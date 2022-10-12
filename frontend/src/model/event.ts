export interface EventRequestItem {
    requestId: number;
    description: string;
}

export enum EventStatus {
    APPROVED_BY_SCSO = "APPROVED_BY_SCSO",
    NEW = "NEW",
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
    reviewComments: string | null;
}
