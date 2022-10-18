import { PRODUCTION_DEPARTMENT_SUBTEAMS, Role, SERVICE_DEPARTMENT_SUBTEAMS } from "model";

export function canEditEvents(role: Role): boolean {
    switch (role) {
        case Role.ADMINISTRATION_MANAGER:
        case Role.FINANCIAL_MANAGER:
        case Role.SENIOR_CUSTOMER_SERVICE_OFFICER:
            return true;
        default:
            return false;
    }
}

export function canAddReviewComments(role: Role): boolean {
    switch (role) {
        case Role.ADMINISTRATION_MANAGER:
        case Role.FINANCIAL_MANAGER:
            return true;
        default:
            return false;
    }
}

export function getDepartmentRoles(managerRole: Role): Role[] {
    switch (managerRole) {
        case Role.SERVICE_MANAGER:
            return SERVICE_DEPARTMENT_SUBTEAMS.flat();
        case Role.PRODUCTION_MANAGER:
            return PRODUCTION_DEPARTMENT_SUBTEAMS.flat();
        default:
            return [];
    }
}

export function getRoleLabel(role: Role): string {
    switch (role) {
        case Role.AUDIO_SPECIALIST:
            return "Audio specialist";
        case Role.TOP_CHEF:
            return "Top chef";
        default:
            console.warn("Unexpected role received - translation not defined", role);
            return "NOT_IMPLEMENTED";
    }
}
