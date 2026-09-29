import { clearAuth } from "@/src/features/auth/store/auth.store";
import axios from "axios";


const api_reservation = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});


api_reservation.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("reservation_access_token");
        
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, 
    (error) =>{
        return Promise.reject(error);
    },
);

api_reservation.interceptors.response.use(
    (response) => response,
    (error) => {
        const isUnauthorized = error.response?.status === 401;
        const url: string = error.config?.url ?? "";

        const isAuthRequest =
            url.includes("/auth/login") || url.includes("/auth/logout");

        if (isUnauthorized && !isAuthRequest) {
            clearAuth();

            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        return Promise.reject(error);
    },
);


export default api_reservation;


