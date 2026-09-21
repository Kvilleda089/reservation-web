import { ReservationStatus } from "../../dashboard/components/reservation-status";
import { AgendaReservation } from "../types/agenda.types";

interface AgendaReservationItemProps {
  reservation: AgendaReservation;
}

const calculateEndHour = (
  hour: string,
  reservedHours: number,
): string => {
  const [hours, minutes] = hour.split(":").map(Number);

  const endHour = hours + reservedHours;

  return `${String(endHour).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}`;
};

export function AgendaReservationItem({
  reservation,
}: AgendaReservationItemProps) {
  const endHour = calculateEndHour(
    reservation.hour,
    reservation.reservedHours,
  );

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">
            {reservation.hour} - {endHour}
          </p>

          <p className="text-sm text-muted-foreground">
            {reservation.client}
          </p>
        </div>

        <span className="w-fit ">
          <ReservationStatus status={reservation.status}/>
        </span>
      </div>
    </div>
  );
}