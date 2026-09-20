

//roles que tenemos definidos 
export const ROLES = {
    SUPER_ADMINISTRATOR: "SUPER_ADMINISTRATOR",
    ADMINISTRATOR: "ADMINISTRATOR",
    COURT_MANAGER: "COURT_MANAGER",
    CLEANING_STAFF: "CLEANING_STAFF",
    RECEPTIONIST: "RECEPTIONIST",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES]