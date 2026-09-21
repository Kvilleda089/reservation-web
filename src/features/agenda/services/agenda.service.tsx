import api_reservation from "@/src/lib/axios/axios";
import { AgendaResponse } from "../types/agenda.types";


export const getAgenda = async (
    date: string,
): Promise<AgendaResponse> => {

    const response = await api_reservation.get<AgendaResponse>(
        `/reservations/agenda/${date}`
    );

    return response.data;
}