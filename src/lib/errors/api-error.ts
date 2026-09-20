import { ApiErrorResponse } from "@/src/types/api-error.response"
import axios from "axios"



export const getApiErrorMessage = (error: unknown): string => {
    if(axios.isAxiosError<ApiErrorResponse>(error)) {
        return (
            error.response?.data.message ??
            "Ocurrió un error al procesar la solicitud."
        );
    };

    if(error instanceof Error ) {
        return error.message;
    };

    return "Ocurrió un error inesperado, volver a intentarlo más tarde.";
}