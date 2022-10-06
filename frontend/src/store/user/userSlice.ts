import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import WebService from "logic/WebService";
import { ResponseType } from "model/api";

// TODO: Refactor
const APP_BASE_URL = "http://localhost:3000/";

interface LoginRequest {
    username: string;
    password: string;
}

export const loginUser = createAsyncThunk(
    "user/login",
    async ({ username, password }: LoginRequest, thunkAPI) => {
        // TODO: Use token from state in other requests?
        // const rootState = thunkAPI.getState();
        console.log("login user thunk");
        const service: WebService = new WebService(APP_BASE_URL);
        const response = await service.login(username, password);
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
    userData: Object;
    loading: "idle" | "pending" | "succeeded" | "failed";
}

export const initialState: UserState = {
    userData: {},
    loading: "idle",
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<Object>) => {
            state.userData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
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
