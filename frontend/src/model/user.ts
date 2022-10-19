export interface User {
    id: string;
    username: string;
    access_token: string;
    role: Role;
}

export interface HiringRequestBase {
    requestedRole: Role;
    comment: string;
}

export enum HiringRequestStatus {
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUBMITTED = "SUBMITTED",
}

export interface HiringRequest extends HiringRequestBase {
    requestor: Role;
    id: string;
    status: HiringRequestStatus;
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

export enum Subteam {
    CHEFS = "CHEF_SUBTEAM",
    AUDIO_SPECIALIST = "AUDIO_SPECIALISTS_SUBTEAM",
}

export const AUDIO_SUBTEAM: Role[] = [Role.AUDIO_SPECIALIST];
export const CHEF_SUBTEAM: Role[] = [Role.TOP_CHEF];

export const PRODUCTION_DEPARTMENT_SUBTEAMS: Role[][] = [AUDIO_SUBTEAM];
export const SERVICE_DEPARTMENT_SUBTEAMS: Role[][] = [CHEF_SUBTEAM];

export const ADMINISTARTION_DEPARTMENT_ROLES: Role[] = [Role.ADMINISTRATION_MANAGER, Role.SENIOR_CUSTOMER_SERVICE_OFFICER];
export const SERVICE_DEPARTMENT_ROLES: Role[] = [Role.SERVICE_MANAGER, Role.TOP_CHEF];
export const PRODUCTION_DEPARTMENT_ROLES: Role[] = [Role.PRODUCTION_MANAGER, Role.AUDIO_SPECIALIST];
