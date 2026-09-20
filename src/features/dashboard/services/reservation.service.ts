import api_reservation from "@/src/lib/axios/axios";
import { ReservationDetailResponse, ReservationResponse } from "../types/reservation-response.type";
import { CreateReservationRequest } from "../types/reservation-request";
import { CreateReservationDepositRequest } from "../types/reservation-deposit-request";



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
};

export const createReservation = async (
    data: CreateReservationRequest,
): Promise<ReservationResponse> => {
    const response = await api_reservation.post<ReservationResponse>(
        "/reservations",
       data
    )

    return response.data;
};

export const createReservationDeposit = async (
  data: CreateReservationDepositRequest
): Promise<ReservationResponse> => {
    const response = await api_reservation.post<ReservationResponse>(
        "/reservation-deposit",
        data,
    )

    return response.data;
};


export const getReservationById = async (
    id: string,
): Promise<ReservationDetailResponse> => {
    const response = await api_reservation.get<ReservationDetailResponse>(
        `/reservations/${id}`,   
    );

    return response.data;
}