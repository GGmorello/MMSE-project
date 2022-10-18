import { AUDIO_SUBTEAM, CHEF_SUBTEAM, Role, Subteam } from "model";

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
