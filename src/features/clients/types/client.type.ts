import { Pagination } from "@/src/types/pagination";
import { Client } from "../../dashboard/types/reservation-response.type";






export interface ClientListResponse {
    statusCode: number;
    data: Client[];
    message: string;
    pagination: Pagination;
};


export interface ClienteRequest {
    firstName?: string;
    surName?: string;
    email?: string;
    phoneNumber?: string;
    page?: number;
    limit?: number;
}