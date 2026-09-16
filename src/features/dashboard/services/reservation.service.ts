import api_reservation from "@/src/lib/axios/axios";
import { ReservationResponse } from "../types/reservation-response.type";



export const getReservation = async (
    page: number,
    limit: number,
): Promise<ReservationResponse> => {

    const response = await api_reservation.get<ReservationResponse>(
        "/reservations",
        {
            params: {
                page,
                limit
            },
        },
    );
    return response.data;
}