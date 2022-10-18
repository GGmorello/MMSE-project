import { Role, Page } from "model";

export function getRolePages(role: Role): Page[] {
    switch (role) {
        case Role.ADMINISTRATION_MANAGER:
            return [Page.BROWSE_EVENT_REQUEST];
        case Role.CUSTOMER_SERVICE:
            return [Page.SUBMIT_EVENT_REQUEST];
        case Role.FINANCIAL_MANAGER:
            return [Page.BROWSE_EVENT_REQUEST];
        case Role.HR_MANAGER:
            return [Page.BROWSE_HIRING_REQUEST];
        case Role.PRODUCTION_MANAGER:
            return [Page.BROWSE_HIRING_REQUEST];
        case Role.SENIOR_CUSTOMER_SERVICE_OFFICER:
            return [Page.BROWSE_EVENT_REQUEST];
        case Role.SERVICE_MANAGER:
            return [Page.BROWSE_HIRING_REQUEST];
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
        case Page.BROWSE_HIRING_REQUEST:
            return "Browse hiring requests";
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
