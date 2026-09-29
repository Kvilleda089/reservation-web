import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getHistoryReservationClientId } from "../../services/client.service";
import { PageLoading } from "@/src/components/loading/page-loading";
import { Client, Reservation } from "@/src/features/dashboard/types/reservation-response.type";
import { RESOURCE_LABELS } from "@/src/features/dashboard/components/dialog/get-reservation-by-id";
import { ReservationStatus } from "@/src/features/dashboard/components/reservation-status";
import { Modal } from "@/src/components/ui/modal";
import { Pagination } from "@/src/components/pagination/pagination";
import {
  Table,
  TableBody,
  TableEmptyRow,
  TableHead,
  TableRow,
  TableScroll,
  Td,
  Th,
} from "@/src/components/ui/table";

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
          limit,
        );

        setReservations(response.data);
        setTotalPage(response.pagination.lastPage);
      } catch (error) {
        toast.error("Lo sentimos, ocurrió un error al obtener el historial.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [open, client, page, limit]);

  if (!client) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Historial de Reservas"
      description={`${client.firstName} ${client.surname} ${client.secondSurname ?? ""}`}
      size="xl"
    >
      <div className="p-6">
        {loading ? (
          <PageLoading />
        ) : reservations.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            Este cliente no tiene reservas registradas.
          </div>
        ) : (
          <>
            <TableScroll>
              <Table>
                <TableHead>
                  <tr>
                    <Th>Fecha</Th>
                    <Th>Recurso</Th>
                    <Th>Hora</Th>
                    <Th className="hidden sm:table-cell">Horas</Th>
                    <Th>Total</Th>
                    <Th>Estado</Th>
                  </tr>
                </TableHead>

                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <Td className="whitespace-nowrap">
                        {reservation.reservationDate.split("T")[0]}
                      </Td>

                      <Td>
                        {RESOURCE_LABELS[reservation.reservationResource]}
                      </Td>

                      <Td className="whitespace-nowrap">
                        {new Date(reservation.hour).toLocaleTimeString(
                          "es-GT",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          },
                        )}
                      </Td>

                      <Td className="hidden sm:table-cell">
                        {reservation.reservedHours}
                      </Td>

                      <Td className="whitespace-nowrap">
                        Q{reservation.totalReservation}
                      </Td>

                      <Td className="whitespace-nowrap">
                        <ReservationStatus status={reservation.status} />
                      </Td>
                    </TableRow>
                  ))}

                  {reservations.length === 0 && (
                    <TableEmptyRow colSpan={6}>
                      Este cliente no tiene reservas registradas.
                    </TableEmptyRow>
                  )}
                </TableBody>
              </Table>
            </TableScroll>

            <Pagination page={page} totalPage={totalPage} onPageChange={setPage} />
          </>
        )}
      </div>
    </Modal>
  );
}