import axios from "axios";



const api_reservation = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});


export default api_reservation;


