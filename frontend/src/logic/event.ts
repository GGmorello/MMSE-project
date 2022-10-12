import { formatISO } from "date-fns";
import { EventBase, EventStatus } from "model";

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

export function getEventStatusLabel(status: EventStatus): string {
    switch (status) {
        case EventStatus.APPROVED_BY_SCSO:
            return "Approved by SCSO";
        case EventStatus.REJECTED_BY_SCSO:
            return "Rejected by SCSO";
        case EventStatus.NEW:
            return "New";
        default:
            console.warn("Unknown event status label received", status);
            return "Unknown";
    }
}
