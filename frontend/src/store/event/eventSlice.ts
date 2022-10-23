import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import WebService from "components/common/WebService";
import { getRoleSubteam, getSubteamRoles } from "logic/user";
import {
    Event,
    EventBase,
    User,
    Response,
    ResponseType,
    LoadingState,
    Task,
    Subteam,
    TaskApplicationBase,
    TaskApplication,
} from "model";
import { RootState } from "store/store";
import { logoutUser } from "store/user/userSlice";

export interface EventState {
    events: Event[];
    tasks: Task[];
    creating: LoadingState;
    loading: LoadingState;
}

export const initialState: EventState = {
    events: [],
    tasks: [],
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

interface TaskRequest {
    taskId: string;
    request: string;
}

export const submitTaskRequest = createAsyncThunk(
    "event/task/request",
    async ({ taskId, request }: TaskRequest, thunkAPI) => {
        const state: RootState = thunkAPI.getState() as RootState;
        const user: User | null = state.user.userData;
        if (user === null) {
            console.warn("user data is null - cannot save event");
            return thunkAPI.rejectWithValue("user is null");
        }
        const subteam: Subteam | null = getRoleSubteam(user.role);
        const service: WebService = new WebService(user.access_token);
        const response: Response<any> = await service.submitTaskRequest(taskId, subteam, user.role, request);
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
    async (
        { id, approved, reviewNotes }: EventStatusUpdateRequest,
        thunkAPI,
    ) => {
        const state: RootState = thunkAPI.getState() as RootState;
        const user: User | null = state.user.userData;
        if (user === null) {
            console.warn("user data is null - cannot save event");
            return thunkAPI.rejectWithValue("user is null");
        }
        const service: WebService = new WebService(user.access_token);
        const response: Response<Event> = await service.updateEventStatus(
            id,
            approved,
            reviewNotes,
        );
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

export const fetchTasks = createAsyncThunk(
    "event/tasks",
    async (_: string = "", thunkAPI) => {
        const state: RootState = thunkAPI.getState() as RootState;
        const user: User | null = state.user.userData;
        if (user === null) {
            console.warn("user data is null - cannot fetch tasks");
            return thunkAPI.rejectWithValue("user is null");
        }
        const service: WebService = new WebService(user.access_token);
        const response: Response<Task[]> = await service.fetchTasks(user.role);
        switch (response.type) {
            case ResponseType.SUCCESSFUL:
                // eslint-disable-next-line no-case-declarations
                const mapped: Task[] = response.data.map((t: Task, i) => ({
                    ...t,
                    taskId: i,
                }));
                thunkAPI.dispatch(setTasks(mapped));
                return mapped;
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
export const createTaskApplication = createAsyncThunk(
    "event/createApplication",
    async (newApplication: TaskApplicationBase, thunkAPI) => {
        const state: RootState = thunkAPI.getState() as RootState;
        const user: User | null = state.user.userData;
        if (user === null) {
            console.warn("user data is null - cannot save event");
            return thunkAPI.rejectWithValue("user is null");
        }
        const service: WebService = new WebService(user.access_token);
        const response: Response<TaskApplication> =
            await service.submitTaskApplication(newApplication);
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
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.fulfilled, (state: EventState) => {
                state.creating = LoadingState.IDLE;
                state.loading = LoadingState.IDLE;
                state.tasks = [];
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
            .addCase(submitTaskRequest.fulfilled, (state: EventState) => {
                state.creating = LoadingState.SUCCEEDED;
            })
            .addCase(submitTaskRequest.pending, (state: EventState) => {
                state.creating = LoadingState.PENDING;
            })
            .addCase(submitTaskRequest.rejected, (state: EventState) => {
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
            .addCase(fetchTasks.fulfilled, (state: EventState) => {
                state.loading = LoadingState.SUCCEEDED;
            })
            .addCase(fetchTasks.pending, (state: EventState) => {
                state.loading = LoadingState.PENDING;
            })
            .addCase(fetchTasks.rejected, (state: EventState) => {
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
            })
            .addCase(createTaskApplication.fulfilled, (state: EventState) => {
                state.loading = LoadingState.SUCCEEDED;
            })
            .addCase(createTaskApplication.pending, (state: EventState) => {
                state.loading = LoadingState.PENDING;
            })
            .addCase(createTaskApplication.rejected, (state: EventState) => {
                state.loading = LoadingState.FAILED;
            });
    },
});

export const { setEvents, setTasks } = eventSlice.actions;

export default eventSlice.reducer;
