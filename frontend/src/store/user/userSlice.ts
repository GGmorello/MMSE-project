import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import WebService from "components/common/WebService";
import { ResponseType } from "model/api";
import { User, Response, LoadingState, Role } from "model";
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

interface HiringRequest {
    requestedRole: Role;
    comment: string;
}

export const submitHiringRequest = createAsyncThunk(
    "user/hire",
    async ({ requestedRole, comment }: HiringRequest, thunkAPI) => {
        const state: RootState = thunkAPI.getState() as RootState;
        const user: User | null = state.user.userData;
        if (user === null) {
            console.warn("user data is null - cannot save event");
            return thunkAPI.rejectWithValue("user is null");
        }
        const service: WebService = new WebService(user.access_token);
        const response: Response<Event> = await service.submitHiringRequest(user.role, requestedRole, comment);
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

export interface UserState {
    userData: User | null;
    loading: LoadingState;
}

export const initialState: UserState = {
    userData: null,
    loading: LoadingState.IDLE,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<User>) => {
            state.userData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.fulfilled, (state: UserState) => {
                state.userData = null;
                state.loading = LoadingState.IDLE;
            })
            .addCase(submitHiringRequest.fulfilled, (state: UserState, action) => {
                state.loading = LoadingState.SUCCEEDED;
            })
            .addCase(submitHiringRequest.pending, (state: UserState) => {
                state.loading = LoadingState.PENDING;
            })
            .addCase(submitHiringRequest.rejected, (state: UserState) => {
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

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
