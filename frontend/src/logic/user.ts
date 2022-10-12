import { Role } from "model";

export function canEditEvents(role: Role): boolean {
    switch (role) {
        case Role.SENIOR_CUSTOMER_SERVICE_OFFICER:
            return true;
        default:
            return false;
    }
}
