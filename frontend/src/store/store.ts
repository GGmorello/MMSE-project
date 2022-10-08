import { configureStore } from "@reduxjs/toolkit";

import messageReducer from "./message/messageSlice";
import userReducer from "./user/userSlice";

export const store = configureStore({
    reducer: {
        message: messageReducer,
        user: userReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
