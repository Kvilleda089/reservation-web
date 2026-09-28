import { Role } from "@/src/constants/roles";

export interface Employee {
    id: string;
    username: string;
    firstName: string;
    surname: string;
    role: Role;
}