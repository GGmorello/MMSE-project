import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import WebService from "components/common/WebService";
import { Event, EventBase, User, Response, ResponseType, LoadingState } from "model";
import { RootState } from "store/store";
import { logoutUser } from "store/user/userSlice";

export interface EventState {
    events: Event[];
    creating: LoadingState;
    loading: LoadingState;
}

export const initialState: EventState = {
    events: [],
    creating: LoadingState.IDLE,
    loading: LoadingState.IDLE,
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

export const fetchEvents = createAsyncThunk(
    "event/get",
    async (id: string = "", thunkAPI) => {
        const state: RootState = thunkAPI.getState() as RootState;
        const user: User | null = state.user.userData;
        if (user === null) {
            console.warn("user data is null - cannot save event");
            return thunkAPI.rejectWithValue("user is null");
        }
        const service: WebService = new WebService(user.access_token);
        const response: Response<Event[]> = await service.fetchEvents();
        switch (response.type) {
            case ResponseType.SUCCESSFUL:
                thunkAPI.dispatch(setEvents(response.data));
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

export interface EventStatusUpdateRequest {
    id: string;
    approved: boolean;
    reviewNotes: string | null;
}

export const updateEventStatus = createAsyncThunk(
    "event/status",
    async ({ id, approved, reviewNotes }: EventStatusUpdateRequest, thunkAPI) => {
        const state: RootState = thunkAPI.getState() as RootState;
        const user: User | null = state.user.userData;
        if (user === null) {
            console.warn("user data is null - cannot save event");
            return thunkAPI.rejectWithValue("user is null");
        }
        const service: WebService = new WebService(user.access_token);
        const response: Response<Event> = await service.updateEventStatus(id, approved, reviewNotes);
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
                state.loading = LoadingState.IDLE;
                state.events = [];
            })
            .addCase(createEvent.fulfilled, (state: EventState) => {
                state.creating = LoadingState.SUCCEEDED;
            })
            .addCase(createEvent.pending, (state: EventState) => {
                state.creating = LoadingState.PENDING;
            })
            .addCase(createEvent.rejected, (state: EventState) => {
                state.creating = LoadingState.FAILED;
            })
            .addCase(updateEventStatus.fulfilled, (state: EventState) => {
                state.loading = LoadingState.SUCCEEDED;
            })
            .addCase(updateEventStatus.pending, (state: EventState) => {
                state.loading = LoadingState.PENDING;
            })
            .addCase(updateEventStatus.rejected, (state: EventState) => {
                state.loading = LoadingState.FAILED;
            })
            .addCase(fetchEvents.fulfilled, (state: EventState) => {
                state.loading = LoadingState.SUCCEEDED;
            })
            .addCase(fetchEvents.pending, (state: EventState) => {
                state.loading = LoadingState.PENDING;
            })
            .addCase(fetchEvents.rejected, (state: EventState) => {
                state.loading = LoadingState.FAILED;
            });
    },
});

export const { setEvents } = eventSlice.actions;

export default eventSlice.reducer;
