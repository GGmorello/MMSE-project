import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import WebService from "components/common/WebService";
import { Event, EventBase, User, Response, ResponseType, LoadingState } from "model";
import { RootState } from "store/store";
import { logoutUser } from "store/user/userSlice";

export interface EventState {
    events: Event[];
    creating: LoadingState;
}

export const initialState: EventState = {
    events: [],
    creating: LoadingState.IDLE,
};

export const createEvent = createAsyncThunk(
    "event/create",
    async (newEvent: EventBase, thunkAPI) => {
        const state: RootState = thunkAPI.getState() as RootState;
        const user: User | null = state.user.userData;
        if (user === null) {
            console.warn("user data is null - cannot save event");
            return thunkAPI.rejectWithValue("user is null");
        }
        const service: WebService = new WebService(user.access_token);
        const response: Response<Event> = await service.createEvent(newEvent);
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

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        setEvents: (state, action: PayloadAction<Event[]>) => {
            state.events = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.fulfilled, (state: EventState) => {
                state.creating = LoadingState.IDLE;
            })
            .addCase(createEvent.fulfilled, (state: EventState) => {
                state.creating = LoadingState.SUCCEEDED;
            })
            .addCase(createEvent.pending, (state: EventState) => {
                state.creating = LoadingState.PENDING;
            })
            .addCase(createEvent.rejected, (state: EventState) => {
                state.creating = LoadingState.FAILED;
            });
    },
});

export const { setEvents } = eventSlice.actions;

export default eventSlice.reducer;
