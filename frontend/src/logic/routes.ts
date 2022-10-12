import { Role, Page } from "model";

export function getRoleRoutes(role: Role): Page[] {
    switch (role) {
        case Role.CUSTOMER_SERVICE:
            return [Page.SUBMIT_EVENT_REQUEST];
        default:
            console.warn(
                "Unexpected role received, cannot calculate routes.",
                role,
            );
            return [];
    }
}

export function getRouteLabel(page: Page): string {
    switch (page) {
        case Page.SUBMIT_EVENT_REQUEST:
            return "Submit event request";
        default:
            console.warn(
                "Unexpected page received, cannot calculate route label:",
                page,
            );
            return "Unknown";
    }
}
