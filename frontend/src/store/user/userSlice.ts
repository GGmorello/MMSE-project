import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import WebService from "components/common/WebService";
import { ResponseType } from "model/api";
import { User, Response } from "model";

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

export interface UserState {
    userData: User | null;
    loading: "idle" | "pending" | "succeeded" | "failed";
}

export const initialState: UserState = {
    userData: null,
    loading: "idle",
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
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.userData = null;
                state.loading = "idle";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.userData = action.payload;
                state.loading = "succeeded";
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = "pending";
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = "failed";
            });
    },
});

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;
