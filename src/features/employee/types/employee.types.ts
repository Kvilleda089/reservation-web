import { Role } from "@/src/constants/roles";



export interface CreateEmployee {

    firstName: string;
    middleName?: string;
    surname: string;
    secondSurname?: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: Role;
    hireDate: string;
}

export interface EmployeeResponse {
    statusCode: number;
    message: string;
    data: Employee;
}

export interface Employee {
  id: string;
  firstName: string;
  middleName: string;
  surname: string;
  secondSurname: string;
  email: string;
  username: string;
  phoneNumber: string | null;
  role: Role;
  status: boolean;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export type EmployeePagination = {
  page: number;
  limit: number;
  totalRecords: number;
  lastPage: number;
};

export interface EmployeeListResponse {
  statusCode: number;
  data: Employee[];
  message: string;
  pagination: EmployeePagination;
}


export interface GetOneEmployeeFilters {
  
    firstName?: string;
    middleName?: string;
    surname?: string;
    secondSurname?: string;
    email?: string;
    username?: string;
    phoneNumber?: string;
    role?: Role;
    status?: boolean;

}

export interface UpdateEmployee extends Partial<CreateEmployee> {
  status?: boolean;
}