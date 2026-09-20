import { Role } from "@/src/constants/roles";



export interface LoginRequest {
    username: string;
    password: string;
};


export interface LoginResponse {

    accessToken: string;
    employee: EmployeeResponse
}

export interface EmployeeResponse {
    id: string;
    username: string;
    firstName: string;
    surname: string;
    role: Role;
}