import {
    AUDIO_SUBTEAM, CHEF_SUBTEAM, Subteam,
    FinancialRequestStatus,
    Role,
    PRODUCTION_DEPARTMENT_SUBTEAMS,
    SERVICE_DEPARTMENT_SUBTEAMS,
    HiringRequestStatus,
} from "model";

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

export function canReviewHiringRequests(role: Role): boolean {
    switch (role) {
        case Role.HR_MANAGER:
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
        case Role.PRODUCTION_MANAGER:
            return "Production manager";
        case Role.SERVICE_MANAGER:
            return "Service manager";
        case Role.TOP_CHEF:
            return "Top chef";
        default:
            console.warn(
                "Unexpected role received - translation not defined",
                role,
            );
            return "NOT_IMPLEMENTED";
    }
}

export function canReviewFinancialRequests(role: Role): boolean {
    switch (role) {
        case Role.FINANCIAL_MANAGER:
            return true;
        default:
            return false;
    }
}

export function getFinancialStatusLabel(
    status: FinancialRequestStatus,
): string {
    switch (status) {
        case FinancialRequestStatus.APPROVED:
            return "Approved";
        case FinancialRequestStatus.REJECTED:
            return "Rejected";
        case FinancialRequestStatus.SUBMITTED:
            return "Submitted";
        default:
            console.warn(
                "Unknown financial status label encountered - cannot determine label",
                status,
            );
            return "Unknown";
    }
}

export function getHiringStatusLabel(status: HiringRequestStatus): string {
    switch (status) {
        case HiringRequestStatus.APPROVED:
            return "Approved";
        case HiringRequestStatus.REJECTED:
            return "Rejected";
        case HiringRequestStatus.SUBMITTED:
            return "Submitted";
        default:
            console.warn("Unexpected hiring status received, cannot determine label", status);
            return "Unknown";
    }
}
