import { Role } from "model";

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

export function canReviewHiringRequests(role: Role): boolean {
    switch (role) {
        case Role.HR_MANAGER:
            return true;
        default:
            return false;
    }
}

export function getRoleLabel(role: Role): string {
    switch (role) {
        case Role.AUDIO_SPECIALIST:
            return "Audio specialist";
        case Role.PRODUCTION_MANAGER:
            return "Production manager";
        case Role.SERVICE_MANAGER:
            return "Service manager";
        case Role.TOP_CHEF:
            return "Top chef";
        default:
            console.warn("Unexpected role received - translation not defined", role);
            return "NOT_IMPLEMENTED";
    }
}
