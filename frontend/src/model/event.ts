export interface EventRequestItem {
    requestId: number;
    description: string;
}

export interface EventBase {
    clientId: string;
    startDate: string; // ISO String: 2020-10-10T10:00:00Z
    endDate: string; // ISO String: 2020-10-10T10:00:00Z
    eventRequestItems: EventRequestItem[];
}

export interface Event extends EventBase {
    eventId: string;
}
