import { AUDIO_SUBTEAM, CHEF_SUBTEAM, PRODUCTION_DEPARTMENT_ROLES, Role, SERVICE_DEPARTMENT_ROLES, Subteam } from "model";

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

export function canSubmitFinancialRequests(role: Role): boolean {
    switch (role) {
        case Role.PRODUCTION_MANAGER:
        case Role.SERVICE_MANAGER:
            return true;
        default:
            return false;
    }
}

export function getSubteamRoles(subteam: Subteam): Role[] {
    switch (subteam) {
        case Subteam.CHEFS:
            return CHEF_SUBTEAM;
        case Subteam.AUDIO_SPECIALIST:
            return AUDIO_SUBTEAM;
        default:
            return [];
    }
}

export function getSubteamDepartmenRoles(subteam: Subteam): Role[] {
    switch (subteam) {
        case Subteam.CHEFS:
            return SERVICE_DEPARTMENT_ROLES;
        case Subteam.AUDIO_SPECIALIST:
            return PRODUCTION_DEPARTMENT_ROLES;
        default:
            return [];
    }
}
