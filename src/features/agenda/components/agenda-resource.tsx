import {
  AgendaReservation,
  AgendaResource as AgendaResourceType,
} from "../types/agenda.types";
import { AgendaReservationItem } from "./agenda-reservation";


interface AgendaResourceProps {
  resource: AgendaResourceType;
  reservations: AgendaReservation[];
}

const RESOURCE_LABELS: Record<AgendaResourceType, string> = {
  CANCHA_1: "Cancha 1",
  CANCHA_2: "Cancha 2",
  SALON: "Salón",
};

const RESOURCE_COLORS: Record<AgendaResourceType, string> = {
  CANCHA_1: "bg-blue-500",
  CANCHA_2: "bg-emerald-500",
  SALON: "bg-violet-500",
};

export function AgendaResource({
  resource,
  reservations,
}: AgendaResourceProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${RESOURCE_COLORS[resource]}`}
          />

          <span className="font-semibold">
            {RESOURCE_LABELS[resource]}
          </span>
        </div>

        <span className="text-sm text-muted-foreground">
          {reservations.length}{" "}
          {reservations.length === 1
            ? "reserva"
            : "reservas"}
        </span>
      </div>

      <div className="p-4">
        {reservations.length === 0 ? (
          <div className="flex min-h-24 items-center justify-center text-sm text-muted-foreground">
            Sin reservas para este recurso
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation, index) => (
              <AgendaReservationItem
                key={`${reservation.hour}-${reservation.client}-${index}`}
                reservation={reservation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}