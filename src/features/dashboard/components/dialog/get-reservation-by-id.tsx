import { useEffect, useState } from "react";

import { ReservationDetail } from "../../types/reservation-response.type";
import { getReservationById } from "../../services/reservation.service";

interface GetReservationDetailsProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

export const RESOURCE_LABELS: Record<string, string> = {
  CANCHA_1: "Cancha 1",
  CANCHA_2: "Cancha 2",
  SALON: "Salón",
};

const STATUS_VARIANTS: Record<string, string> = {
  CONFIRMADA: "success",
  PENDIENTE: "warning",
  CANCELADA: "danger",
  FINALIZADA: "secondary",
};

function formatCurrency(value: string | number) {
  return `Q${Number(value).toFixed(2)}`;
}

function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatHour(isoHour: string) {
  return new Date(isoHour).toLocaleTimeString("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function GetReservationDetailsById({
  id,
  open,
  onClose,
}: GetReservationDetailsProps) {
  const [reservation, setReservation] = useState<ReservationDetail | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !id) return;

    let cancelled = false;

    async function fetchReservation() {
      setLoading(true);
      setError(null);
      setReservation(null);

      try {
        const response = await getReservationById(id);

        if (!cancelled) {
          setReservation(response.data);
        }
      } catch (err) {
        console.error("Error al obtener detalle de reserva:", err);

        if (!cancelled) {
          setError("No se pudo cargar el detalle de la reserva.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchReservation();

    return () => {
      cancelled = true;
    };
  }, [id, open]);

  if (!open) return null;

  const client = reservation?.client;

  const initials = client
    ? `${client.firstName[0] ?? ""}${client.surname[0] ?? ""}`.toUpperCase()
    : "";

  const totalDeposited =
    reservation?.deposits.reduce(
      (sum, deposit) => sum + Number(deposit.amount),
      0,
    ) ?? 0;

  const pendingBalance = reservation
    ? Number(reservation.totalReservation) - totalDeposited
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold">Detalle de reserva</h2>

            <p className="text-sm text-gray-500">
              Información completa de la reserva
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-5">
          {/* Loading */}
          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-sm text-gray-500">
                Cargando detalle de la reserva...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Reservation */}
          {!loading && !error && reservation && (
            <div className="space-y-6">
              {/* Client */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-gray-500">
                  CLIENTE
                </h3>

                <div className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 font-semibold">
                    {initials}
                  </div>

                  <div>
                    <p className="font-semibold">
                      {client?.firstName} {client?.middleName ?? ""}{" "}
                      {client?.surname} {client?.secondSurname ?? ""}
                    </p>

                    <p className="text-sm text-gray-500">
                      {client?.phoneNumber}
                    </p>

                    {client?.email && (
                      <p className="text-sm text-gray-500">{client.email}</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Reservation information */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-gray-500">
                  RESERVACIÓN
                </h3>

                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <p className="text-xs text-gray-500">Recurso</p>

                    <p className="font-medium">
                      {RESOURCE_LABELS[reservation.reservationResource] ??
                        reservation.reservationResource}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Estado</p>

                    <p className="font-medium">{reservation.status}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Fecha</p>

                    <p className="font-medium">
                      {formatDate(reservation.reservationDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Hora</p>

                    <p className="font-medium">
                      {formatHour(reservation.hour)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Horas reservadas</p>

                    <p className="font-medium">
                      {reservation.reservedHours}{" "}
                      {reservation.reservedHours === 1 ? "hora" : "horas"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Financial summary */}
              <section>
                <h3 className="mb-3 text-sm font-semibold text-gray-500">
                  RESUMEN DE PAGO
                </h3>

                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-gray-500">Total</p>

                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(reservation.totalReservation)}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-gray-500">Abonado</p>

                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(totalDeposited)}
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-gray-500">Pendiente</p>

                    <p className="mt-1 text-lg font-semibold">
                      {formatCurrency(pendingBalance)}
                    </p>
                  </div>
                </div>
              </section>

              {/* Deposits */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-500">
                    ANTICIPOS
                  </h3>

                  <span className="text-sm text-gray-500">
                    {reservation.deposits.length}{" "}
                    {reservation.deposits.length === 1
                      ? "registro"
                      : "registros"}
                  </span>
                </div>

                {reservation.deposits.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <p className="text-sm text-gray-500">
                      No hay anticipos registrados.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-500">
                            Fecha
                          </th>

                          <th className="px-4 py-3 text-right font-medium text-gray-500">
                            Monto
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {reservation.deposits.map((deposit) => (
                          <tr key={deposit.id} className="border-t">
                            <td className="px-4 py-3">
                              {formatDate(deposit.createdAt)}
                            </td>

                            <td className="px-4 py-3 text-right font-medium">
                              {formatCurrency(deposit.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
