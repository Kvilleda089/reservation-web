import { Permission, ROLE_PERMISSIONS } from "@/src/constants/permissions";
import { Role } from "@/src/constants/roles";




export const can = (
    role: Role,
    permission: Permission,
): boolean => {
    return ROLE_PERMISSIONS[role].includes(permission);
}