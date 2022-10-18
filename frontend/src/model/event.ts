import { Subteam } from "model";

export interface EventRequestItem {
    requestId: number;
    description: string;
}

export enum EventStatus {
    APPROVED_BY_ADM = "APPROVED_BY_ADM",
    APPROVED_BY_FM = "APPROVED_BY_FM",
    APPROVED_BY_SCSO = "APPROVED_BY_SCSO",
    NEW = "NEW",
    REJECTED_BY_ADM = "REJECTED_BY_ADM",
    REJECTED_BY_FM = "REJECTED_BY_FM",
    REJECTED_BY_SCSO = "REJECTED_BY_SCSO",
}

export interface EventBase {
    clientId: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    eventRequestItems: EventRequestItem[];
}

export interface Event extends EventBase {
    id: string;
    status: EventStatus;
    reviewNotes: string | null;
}

export interface TaskApplicationBase {
    eventId: string;
    tasks: TaskBase[];
}

export interface TaskApplication extends TaskApplicationBase {
    id: string;
    tasks: Task[];
}

export interface TaskBase {
    taskId: number;
    eventId: string;
    subteamId: Subteam;
    description: string;
}

export interface Task extends TaskBase {
    id: string;
}
