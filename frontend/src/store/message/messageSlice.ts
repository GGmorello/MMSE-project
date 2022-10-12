import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "model";

export interface MessageState {
    messages: Message[];
}

export const initialState: MessageState = {
    messages: [],
};

export const messageSlice = createSlice({
    name: "message",
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
    },
});

export const { addMessage, setMessages } = messageSlice.actions;

export default messageSlice.reducer;
