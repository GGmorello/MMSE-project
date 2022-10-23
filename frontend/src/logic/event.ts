import { formatISO } from "date-fns";
import { EventBase, EventStatus, Subteam, TaskApplicationBase, TaskBase } from "model";

/**
 * Creates a default event for the provided user
 * @returns {Event}
 */
export function createDefaultEvent(): EventBase {
    const now = new Date();
    const startDate = formatISO(now, { representation: "date" });
    const endDate = startDate;

    return {
        clientId: "",
        startDate,
        endDate,
        eventRequestItems: [],
    };
}

export function createDefaultTaskApplication(): TaskApplicationBase {
    const application: TaskApplicationBase = {
        eventId: "",
        tasks: [],
    };
    return application;
}

export function createDefaultTask(): TaskBase {
    const task: TaskBase = {
        taskId: 0,
        eventId: "",
        subteamId: Subteam.CHEFS,
        description: "",
    };
    return task;
}

export function getEventStatusLabel(status: EventStatus): string {
    switch (status) {
        case EventStatus.APPROVED_BY_ADM:
            return "Approved by ADM";
        case EventStatus.APPROVED_BY_FM:
            return "Approved by FM";
        case EventStatus.APPROVED_BY_SCSO:
            return "Approved by SCSO";
        case EventStatus.IN_PROGRESS:
            return "In progress";
        case EventStatus.NEW:
            return "New";
        case EventStatus.REJECTED_BY_ADM:
            return "Rejected by ADM";
        case EventStatus.REJECTED_BY_FM:
            return "Rejected by FM";
        case EventStatus.REJECTED_BY_SCSO:
            return "Rejected by SCSO";
        default:
            console.warn("Unknown event status label received", status);
            return "Unknown";
    }
}
