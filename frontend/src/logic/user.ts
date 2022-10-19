import {
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
