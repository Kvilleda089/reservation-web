import { Permission, ROLE_PERMISSIONS } from "@/src/constants/permissions";
import { Role } from "@/src/constants/roles";

export const can = (
    role: Role,
    permission: Permission,
): boolean => {
    return ROLE_PERMISSIONS[role].includes(permission);
};

/**
 * Rutas de la aplicación en orden de prioridad.
 * La primera a la que el rol tenga permiso será su "inicio".
 */
const ROUTES_BY_PRIORITY: { href: string; permission: Permission }[] = [
    { href: "/dashboard", permission: "reservations.read" },
    { href: "/agenda", permission: "agenda.read" },
    { href: "/client", permission: "clients.read" },
    { href: "/employee", permission: "employees.read" },
    { href: "/statistics", permission: "statistics.read" },
];

/**
 * Devuelve la primera ruta a la que el rol puede entrar,
 * o null si no tiene acceso a ninguna.
 */
export const getDefaultRoute = (role: Role): string | null => {
    const route = ROUTES_BY_PRIORITY.find((item) => can(role, item.permission));

    return route ? route.href : null;
};