import api_reservation from "@/src/lib/axios/axios";
import { LoginRequest, LoginResponse } from "../types/auth.types";



export const login = async (
    credentials: LoginRequest
): Promise<LoginResponse> => {
    const response = await api_reservation.post<LoginResponse>(
        "/auth/login",
        credentials,
    );


    return response.data;
}

