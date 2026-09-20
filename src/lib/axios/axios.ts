import axios from "axios";
import { error } from "console";



const api_reservation = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});


api_reservation.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("reservation_access_token");
        
        if(token){
            config.headers.Authorization = ` Bearer ${token}`;
        }
        return config;
    }, 
    (error) =>{
        return Promise.reject(error);
    },
);




export default api_reservation;


