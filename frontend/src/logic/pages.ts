import { Role, Page } from "model";

export function getRolePages(role: Role): Page[] {
    switch (role) {
        case Role.ADMINISTRATION_MANAGER:
            return [Page.BROWSE_EVENT_REQUEST];
        case Role.CUSTOMER_SERVICE:
            return [Page.SUBMIT_EVENT_REQUEST];
        case Role.FINANCIAL_MANAGER:
            return [Page.BROWSE_EVENT_REQUEST];
        case Role.PRODUCTION_MANAGER:
            return [Page.BROWSE_EVENT_REQUEST, Page.SUBMIT_TASK_APPLICATION];
        case Role.SENIOR_CUSTOMER_SERVICE_OFFICER:
            return [Page.BROWSE_EVENT_REQUEST];
        case Role.SERVICE_MANAGER:
            return [Page.BROWSE_EVENT_REQUEST, Page.SUBMIT_TASK_APPLICATION];
        default:
            console.warn(
                "Unexpected role received, cannot calculate routes.",
                role,
            );
            return [];
    }
}

export function getPageLabel(page: Page): string {
    switch (page) {
        case Page.BROWSE_EVENT_REQUEST:
            return "Browse event requests";
        case Page.SUBMIT_EVENT_REQUEST:
            return "Submit event request";
        case Page.SUBMIT_TASK_APPLICATION:
            return "Submit task application";
        default:
            console.warn(
                "Unexpected page received, cannot calculate route label:",
                page,
            );
            return "Unknown";
    }
}
