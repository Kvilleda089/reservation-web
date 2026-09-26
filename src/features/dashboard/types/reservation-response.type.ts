import { Pagination } from "@/src/types/pagination";
import { ReservationStatus } from "./reservation.type";



export interface ReservationResponse {
    statusCode: number;
    data: Reservation[];
    message: string;
    pagination: Pagination;
}

export interface Reservation {
  id: string;
  clientId: string;
  reservationResource: string;
  hour: string;
  totalReservation: string;
  reservedHours: number;
  status: ReservationStatus;
  reservationDate: string;
  createdAt: string;
  updatedAt: string;
  client: Client;
}

export interface Client {
  id: string;
  firstName: string;
  middleName: string | null;
  surname: string;
  secondSurname: string | null;
  email: string | null;
  status: boolean;
  phoneNumber: string | null;
  dateRegistration: string;
  createdAt: string;
  updatedAt: string;
}



export interface Deposit {
  id: string;
  reservationId: string;
  amount: string;
  createdAt: string;
}
 
export interface ReservationDetail extends Reservation {
  deposits: Deposit[];
}
 
export interface ReservationDetailResponse {
  statusCode: number;
  message: string;
  data: ReservationDetail;
}