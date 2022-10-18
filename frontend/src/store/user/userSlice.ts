import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import WebService from "components/common/WebService";
import { ResponseType } from "model/api";
import { User, Response, LoadingState, HiringRequest, Role } from "model";
import { RootState } from "store/store";

interface LoginRequest {
    username: string;
    password: string;
}

export const loginUser = createAsyncThunk(
    "user/login",
    async ({ username, password }: LoginRequest, thunkAPI) => {
        const service: WebService = new WebService();
        const response: Response<User> = await service.login(username, password);
        switch (response.type) {
            case ResponseType.SUCCESSFUL:
                return response.data;
            case ResponseType.ERROR:
                return thunkAPI.rejectWithValue(undefined);
            default:
                console.log(
                    "unexpected return type from login request: ",
                    response,
                );
                return thunkAPI.rejectWithValue(undefined);
        }
    },
);

// just created as a mock so other slices can react to logout
export const logoutUser = createAsyncThunk(
    "user/logout",
    async (_: any, thunkAPI) => {
        thunkAPI.fulfillWithValue("ok");
    },
);

export const fetchHiringRequests = createAsyncThunk(
    "user/requests",
    async(_: any, thunkAPI) => {
        const state: RootState = thunkAPI.getState() as RootState;
        const user: User | null = state.user.userData;
        if (user === null) {
            console.warn("user data is null - cannot save event");
            return thunkAPI.rejectWithValue("user is null");
        }
        const service: WebService = new WebService(user.access_token);
        const response: Response<HiringRequest[]> = await service.fetchHiringRequests();
        switch (response.type) {
            case ResponseType.SUCCESSFUL: {
                // do some manual filtering here since we're mocking the
                // backend response
                let requests: HiringRequest[] = response.data;
                if (user.role !== Role.HR_MANAGER) {
                    requests = requests.filter((hr: HiringRequest) => hr.submittor === user.role);
                }
                thunkAPI.dispatch(setHiringRequests(requests));
                return response.data;
            }
            case ResponseType.ERROR:
                return thunkAPI.rejectWithValue(undefined);
            default:
                console.log(
                    "unexpected return type from login request: ",
                    response,
                );
                return thunkAPI.rejectWithValue(undefined);
        }
    },
);

export interface UserState {
    userData: User | null;
    hiringRequests: HiringRequest[];
    loading: LoadingState;
}

export const initialState: UserState = {
    userData: null,
    hiringRequests: [],
    loading: LoadingState.IDLE,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<User>) => {
            state.userData = action.payload;
        },
        setHiringRequests: (state, action: PayloadAction<HiringRequest[]>) => {
            state.hiringRequests = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.fulfilled, (state: UserState) => {
                state.userData = null;
                state.hiringRequests = [];
                state.loading = LoadingState.IDLE;
            })
            .addCase(fetchHiringRequests.fulfilled, (state: UserState) => {
                state.loading = LoadingState.SUCCEEDED;
            })
            .addCase(fetchHiringRequests.pending, (state: UserState) => {
                state.loading = LoadingState.PENDING;
            })
            .addCase(fetchHiringRequests.rejected, (state: UserState) => {
                state.loading = LoadingState.FAILED;
            })
            .addCase(loginUser.fulfilled, (state: UserState, action) => {
                state.userData = action.payload;
                state.loading = LoadingState.SUCCEEDED;
            })
            .addCase(loginUser.pending, (state: UserState) => {
                state.loading = LoadingState.PENDING;
            })
            .addCase(loginUser.rejected, (state: UserState) => {
                state.loading = LoadingState.FAILED;
            });
    },
});

export const { setUserData, setHiringRequests } = userSlice.actions;

export default userSlice.reducer;
