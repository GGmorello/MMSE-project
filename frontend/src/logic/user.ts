import { AUDIO_SUBTEAM, CHEF_SUBTEAM, PRODUCTION_DEPARTMENT_SUBTEAMS, Role, SERVICE_DEPARTMENT_SUBTEAMS, Subteam } from "model";

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

export function getRoleSubteam(role: Role): Subteam | null {
    // currently hardcoded to chef and audio specialist subteams
    const isServiceSubteam: boolean = SERVICE_DEPARTMENT_SUBTEAMS.some((subTeam: Role[]) => subTeam.includes(role));
    const isProductionSubteam: boolean = PRODUCTION_DEPARTMENT_SUBTEAMS.some((subTeam: Role[]) => subTeam.includes(role));
    switch (true) {
        case isServiceSubteam:
            return Subteam.CHEFS;
        case isProductionSubteam:
            return Subteam.AUDIO_SPECIALIST;
        default:
            return null;
    }
}
