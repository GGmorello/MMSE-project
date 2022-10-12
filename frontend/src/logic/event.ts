import { formatISO } from "date-fns";
import { EventBase } from "model";

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
