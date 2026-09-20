export interface CreateReservationRequest {
  client: ClientDto;
  reservation: ReservationDto;
  deposit?: DepositDto;
}

export interface ClientDto {
  firstName: string;
  middleName?: string;
  surname: string;
  secondSurname: string;
  email?: string;
  dateRegistration: string;
  phoneNumber?: string;
}

export interface ReservationDto {
  hour: string;
  reservationDate: string;
  reservationResource: ReservationResourceEnum;
  status: StatusReservationEnum;
  reservedHours: number;
  totalReservation: number;
}

export interface DepositDto {
  amount: number;
}

export enum ReservationResourceEnum {
  CANCHA_1 = "CANCHA_1",
  CANCHA_2 = "CANCHA_2",
  SALON = "SALON",
}

export enum StatusReservationEnum {
  PENDIENTE = "PENDIENTE",
  CONFIRMADA = "CONFIRMADA",
  CANCELADA = "CANCELADA",
  FINALIZADA = "FINALIZADA",
}