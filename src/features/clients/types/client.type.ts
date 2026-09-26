import { Pagination } from "@/src/types/pagination";
import { Client } from "../../dashboard/types/reservation-response.type";






export interface ClientListResponse {
    statusCode: number;
    data: Client[];
    message: string;
    pagination: Pagination;
};
