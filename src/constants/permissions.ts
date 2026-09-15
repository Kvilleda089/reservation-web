

import { ROLES, type Role } from "./roles";

//Clase que nos permite registrar los permisos que habrá dentro de la aplicación
export const PERMISSIONS = {
    RESERVATIONS_READ: "reservations.read",
    RESERVATIONS_CREATE: "reservations.create",
    RESERVATIONS_UPDATE: "reservations.update",
    RESERVATIONS_CANCEL: "reservations.cancel",

    AGENDA_READ: "agenda.read",
} as const;

export type Permission =
    (typeof PERMISSIONS)[keyof typeof PERMISSIONS];


export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
    [ROLES.SUPER_ADMINISTRATOR]: [
        PERMISSIONS.RESERVATIONS_READ,
        PERMISSIONS.RESERVATIONS_CREATE,
        PERMISSIONS.RESERVATIONS_UPDATE,
        PERMISSIONS.RESERVATIONS_CANCEL,
        PERMISSIONS.AGENDA_READ,
    ],

    [ROLES.ADMINISTRATOR]: [
        PERMISSIONS.RESERVATIONS_READ,
        PERMISSIONS.RESERVATIONS_CREATE,
    ],

    [ROLES.RECEPTIONIST]: [
        PERMISSIONS.RESERVATIONS_READ,
        PERMISSIONS.RESERVATIONS_CREATE,
    ],

    [ROLES.COURT_MANAGER]: [
        PERMISSIONS.AGENDA_READ,
    ],

    [ROLES.CLEANING_STAFF]: [
        PERMISSIONS.AGENDA_READ,
    ],
};