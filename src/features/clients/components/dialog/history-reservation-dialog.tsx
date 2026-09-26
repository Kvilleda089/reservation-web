import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getHistoryReservationClientId } from "../../services/client.service";
import { PageLoading } from "@/src/components/loading/page-loading";
import { Client, Reservation } from "@/src/features/dashboard/types/reservation-response.type";
import { StatusBadge } from "@/src/features/employee/components/ui/status-badge";
import { RESOURCE_LABELS } from "@/src/features/dashboard/components/dialog/get-reservation-by-id";
import { ReservationStatus } from "@/src/features/dashboard/components/reservation-status";

interface HistoryReservationsProps {
  open: boolean;
  client: Client | null;
  onClose: () => void;
}

export function HistoryReservationDialog({
  open,
  client,
  onClose,
}: HistoryReservationsProps) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    if (!open || !client) return;

    const fetchHistory = async () => {
      try {
        setLoading(true);

        const response = await getHistoryReservationClientId(
          client.id,
          page,
          limit
        );

        setReservations(response.data);
        setTotalPage(response.pagination.lastPage);
      } catch (error) {
        toast.error(
          "Lo sentimos, ocurrió un error al obtener el historial."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [open, client, page, limit]);

  if (!open || !client) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-xl bg-white p-6 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Historial de Reservas
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {client.firstName} {client.surname} {client.secondSurname ?? ""}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Cerrar
          </button>
        </div>

        {/* Contenido */}
        <div className="mt-6">
          {loading ? (
            <PageLoading />
          ) : reservations.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Este cliente no tiene reservas registradas.
            </div>
          ) : (
            <>
              {/* Tabla */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">
                        Fecha
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Recurso
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Hora
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Horas
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Total
                      </th>

                      <th className="px-4 py-3 font-semibold">
                        Estado
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {reservations.map((reservation) => (
                      <tr
                        key={reservation.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">
                          {reservation.reservationDate.split("T")[0]}
                        </td>

                        <td className="px-4 py-3 font-medium text-gray-900">
                          {RESOURCE_LABELS[reservation.reservationResource]}
                        </td>

                        <td className="px-4 py-3">
                          {new Date(
                            reservation.hour
                          ).toLocaleTimeString("es-GT", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })}
                        </td>

                        <td className="px-4 py-3">
                          {reservation.reservedHours}
                        </td>

                        <td className="px-4 py-3">
                          Q{reservation.totalReservation}
                        </td>

                        <td className="px-4 py-3">
                  
                            <ReservationStatus status={reservation.status} />
                          
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Anterior
                </button>

                <span className="text-sm text-gray-600">
                  Página {page} de {totalPage}
                </span>

                <button
                  type="button"
                  disabled={page === totalPage}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}