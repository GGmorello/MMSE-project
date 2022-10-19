import { FinancialRequestStatus, Role } from "model";

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

export function canReviewFinancialRequests(role: Role): boolean {
    switch (role) {
        case Role.FINANCIAL_MANAGER:
            return true;
        default:
            return false;
    }
}

export function getFinancialStatusLabel(status: FinancialRequestStatus): string {
    switch (status) {
        case FinancialRequestStatus.APPROVED:
            return "Approved";
        case FinancialRequestStatus.REJECTED:
            return "Rejected";
        case FinancialRequestStatus.SUBMITTED:
            return "Submitted";
        default:
            console.warn("Unknown financial status label encountered - cannot determine label", status);
            return "Unknown";
    }
}
