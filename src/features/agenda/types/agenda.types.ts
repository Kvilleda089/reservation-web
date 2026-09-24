export type AgendaResource =
  | "CANCHA_1"
  | "CANCHA_2"
  | "SALON";

export type AgendaReservationStatus =
  | "PENDIENTE"
  | "CONFIRMADA";

export interface AgendaReservation {
  hour: string;
  reservedHours: number;
  client: string;
  status: AgendaReservationStatus;
}

export interface AgendaResourceData {
  resource: AgendaResource;
  reservations: AgendaReservation[];
}

export interface AgendaResponse {
  date: string;
  resources: AgendaResourceData[];
}