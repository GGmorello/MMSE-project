export interface User {
    id: string;
    username: string;
    access_token: string;
    role: Role;
}

export enum Role {
    ADMINISTRATION_MANAGER = "ADMINISTRATION_MANAGER",
    AUDIO_SPECIALIST = "AUDIO_SPECIALIST",
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
    FINANCIAL_MANAGER = "FINANCIAL_MANAGER",
    HR_MANAGER = "HR_MANAGER",
    PRODUCTION_MANAGER = "PRODUCTION_MANAGER",
    SENIOR_CUSTOMER_SERVICE_OFFICER = "SENIOR_CUSTOMER_SERVICE_OFFICER",
    SERVICE_MANAGER = "SERVICE_MANAGER",
    TOP_CHEF = "TOP_CHEF",
}

export interface HiringRequest {
    id: string;
    submittor: Role;
    requestedRole: Role;
    comment: string;
}
