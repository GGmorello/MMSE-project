import { Role, Page, SERVICE_DEPARTMENT_SUBTEAMS, PRODUCTION_DEPARTMENT_SUBTEAMS } from "model";

export function getRolePages(role: Role): Page[] {
    const departmentPages: Page[] = getSubteamPages(role);
    switch (role) {
        case Role.AUDIO_SPECIALIST:
            return [...departmentPages];
        case Role.ADMINISTRATION_MANAGER:
            return [Page.BROWSE_EVENT_REQUEST, ...departmentPages];
        case Role.CUSTOMER_SERVICE:
            return [Page.SUBMIT_EVENT_REQUEST, ...departmentPages];
        case Role.TOP_CHEF:
            return [...departmentPages];
        case Role.FINANCIAL_MANAGER:
            return [Page.BROWSE_EVENT_REQUEST, ...departmentPages];
        case Role.SENIOR_CUSTOMER_SERVICE_OFFICER:
            return [Page.BROWSE_EVENT_REQUEST, ...departmentPages];
        default:
            console.warn(
                "Unexpected role received, cannot calculate routes.",
                role,
            );
            return [];
    }
}

export function getSubteamPages(role: Role): Page[] {
    const isServiceSubteam: boolean = SERVICE_DEPARTMENT_SUBTEAMS.some((subTeam: Role[]) => subTeam.includes(role));
    const isProductionSubteam: boolean = PRODUCTION_DEPARTMENT_SUBTEAMS.some((subTeam: Role[]) => subTeam.includes(role));
    switch (true) {
        case isProductionSubteam:
        case isServiceSubteam:
            return [Page.BROWSE_TEAM_TASKS];
        default:
            return [];
    }
}

export function getPageLabel(page: Page): string {
    switch (page) {
        case Page.BROWSE_EVENT_REQUEST:
            return "Browse event requests";
        case Page.BROWSE_TEAM_TASKS:
            return "Browse team tasks";
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
