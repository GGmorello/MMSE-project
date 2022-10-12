export interface User {
    id: string;
    username: string;
    accessToken: string;
    role: Role;
}

export enum Role {
    ADMINISTRATION_MANAGER = "ADMINISTRATION_MANAGER",
    CHEF_SUBTEAM = "CHEF_SUBTEAM",
    CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
    FINANCIAL_MANAGER = "FINANCIAL_MANAGER",
    HR_MANAGER = "HR_MANAGER",
    NETWORK_SUBTEAM = "NETWORK_SUBTEAM",
    PRODUCTION_MANAGER = "PRODUCTION_MANAGER",
    SENIOR_CUSTOMER_SERVICE_OFFICER = "SENIOR_CUSTOMER_SERVICE_OFFICER",
    SERVICE_MANAGER = "SERVICE_MANAGER",
}