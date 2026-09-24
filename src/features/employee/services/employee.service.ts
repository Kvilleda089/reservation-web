import api_reservation from "@/src/lib/axios/axios";
import { CreateEmployee, EmployeeListResponse, EmployeeResponse, GetOneEmployeeFilters, UpdateEmployee } from "../types/employee.types";




export const createEmployee = async (
    data: CreateEmployee,
): Promise<EmployeeResponse> => {

    const response = await api_reservation.post<EmployeeResponse>(
        "/employees",
        data,
    );

    return response.data;
};

export const getAllEmployee = async (
    page: number,
    limit: number,
): Promise<EmployeeListResponse> => {

    const response = await api_reservation.get<EmployeeListResponse>(
        "/employees",
        {
            params: {
                page,
                limit,
            }
        }
    );

    return response.data;
};

export const getEmployeeOne  = async (
    filters: GetOneEmployeeFilters,
): Promise<EmployeeResponse> => {
    const response = await api_reservation.get<EmployeeResponse>(
        "/employees/one",
        {
            params: filters,

        }
    );

    return response.data;
};

export const updateEmploye = async (
    id: string,
    dataUpdate: UpdateEmployee
): Promise<EmployeeResponse> => {
    const response = await api_reservation.patch<EmployeeResponse>(
        `/employees/${id}`,
        dataUpdate,
    );

    return response.data;
}