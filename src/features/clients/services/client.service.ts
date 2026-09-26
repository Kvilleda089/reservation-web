import { ReservationResponse } from "../../dashboard/types/reservation-response.type";
import { ClientListResponse } from "../types/client.type";
import api_reservation from "@/src/lib/axios/axios";


export const getAllClientsList = async (
    page: number,
    limit: number
): Promise<ClientListResponse> => {
    const response = await api_reservation.get<ClientListResponse>(
        "/clients",
        {
            params: {
                page,
                limit,
            }
        }
    );
    return response.data;
};

export const getHistoryReservationClientId = async (
    id: string,
    page: number = 1,
    limit: number = 10,
): Promise<ReservationResponse> => {
    const response = await api_reservation.get<ReservationResponse>(
        `/reservations/client/${id}`,
        {
            params: {
                page, 
                limit
            }
        }
    );

    return response.data;
}

