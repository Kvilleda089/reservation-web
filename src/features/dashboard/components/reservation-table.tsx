import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { Reservation } from "../types/reservation-response.type";
import { getReservation } from "../services/reservation.service";

import { ReservationStatus } from "./reservation-status";
import { ActionsMenu } from "../../../components/ui/action-menu";
import { CreateReservationDialog } from "./dialog/create-reservation";
import { CreateReservationDeposit } from "./dialog/reservation-deposit";
import {
  GetReservationDetailsById,
  RESOURCE_LABELS,
} from "./dialog/get-reservation-by-id";
import { PageLoading } from "@/src/components/loading/page-loading";
import { Pagination } from "@/src/components/pagination/pagination";
import { EditReservationDialog } from "./dialog/edit-reservation";

export function ReservationTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [filters, setFilters] = useState({
    date: "",
    cliente: "",
    hour: "",
    status: "",
  });

  //Open Dialogo
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  //Dialogo deposito
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  //Dialogo detalles reservaciones
  const [openReservationDetails, setOpenReservationDetails] = useState(false);

  //Dialog edicion reservaciones
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [refreshReservations, setRefreshReservations] = useState(0);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);

        const response = await getReservation(page, limit);

        setReservations(response.data);
        setTotalPage(Math.ceil(response.pagination.totalRecords / limit));
      } catch (error) {
        console.error("Error al obtener reservaciones: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [page, limit, refreshReservations]);

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const formatHour = (date: string) => {
    return date.split("T")[1].substring(0, 5);
  };

  const filteredReservations = reservations.filter((reservation) => {
    const reservationDate = formatDate(reservation.reservationDate);
    const reservationHour = formatHour(reservation.hour);

    const clientName =
      `${reservation.client.firstName} ${reservation.client.surname} ${reservation.client.secondSurname}`
        .toLowerCase()
        .trim();

    const matchesDate = !filters.date || reservationDate === filters.date;

    const matchesClient =
      !filters.cliente || clientName.includes(filters.cliente.toLowerCase());

    const matchesHour = !filters.hour || reservationHour === filters.hour;

    const matchesStatus =
      !filters.status || reservation.status === filters.status;

    return matchesDate && matchesClient && matchesHour && matchesStatus;
  });

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Filtros */}
      <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Fecha
          </label>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Cliente
          </label>

          <input
            type="text"
            placeholder="Buscar cliente..."
            value={filters.cliente}
            onChange={(e) => handleFilterChange("cliente", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Hora
          </label>

          <input
            type="time"
            value={filters.hour}
            onChange={(e) => handleFilterChange("hour", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Estado
          </label>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="FINALIZADA">Finalizada</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end my-4 ">
        <button
          type="button"
          onClick={() => setOpenCreateDialog(true)}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Crear Nueva Reserva
        </button>
      </div>

      {/* Tabla */}
      <div className="w-full">
        <table className="w-full table-auto text-left text-sm text-gray-600">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="hidden whitespace-nowrap px-3 py-4 font-semibold md:table-cell lg:px-4">
                Fecha
              </th>

              <th className="px-3 py-4 font-semibold lg:px-4">Cliente</th>

              <th className="px-3 py-4 font-semibold lg:px-4">Recurso</th>

              <th className="whitespace-nowrap px-3 py-4 font-semibold lg:px-4">
                Hora
              </th>

              <th className="hidden whitespace-nowrap px-3 py-4 font-semibold sm:table-cell lg:px-4">
                Horas
              </th>

              <th className="whitespace-nowrap px-3 py-4 font-semibold lg:px-4">
                Total
              </th>

              <th className="px-3 py-4 font-semibold lg:px-4">Estado</th>

              <th className="w-12 px-2 py-4 text-center font-semibold">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredReservations.map((reservation) => (
              <tr
                key={reservation.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="hidden whitespace-nowrap px-3 py-4 font-medium text-gray-900 md:table-cell lg:px-4">
                  {formatDate(reservation.reservationDate)}
                </td>

                <td className="max-w-0 px-3 py-4 font-medium text-gray-900 lg:px-4">
                  <div
                    className="break-words"
                    title={`${reservation.client.firstName} ${reservation.client.surname} ${reservation.client.secondSurname}`}
                  >
                    {reservation.client.firstName} {reservation.client.surname}{" "}
                    {reservation.client.secondSurname}
                  </div>
                </td>

                <td className="px-3 py-4 font-medium text-gray-900 lg:px-4">
                  <div className="truncate">
                    {RESOURCE_LABELS[reservation.reservationResource] ??
                      reservation.reservationResource}
                  </div>
                </td>

                <td className="whitespace-nowrap px-3 py-4 font-medium text-gray-900 lg:px-4">
                  {formatHour(reservation.hour)}
                </td>

                <td className="hidden whitespace-nowrap px-3 py-4 font-medium text-gray-900 sm:table-cell lg:px-4">
                  {reservation.reservedHours}
                </td>

                <td className="whitespace-nowrap px-3 py-4 font-medium text-gray-900 lg:px-4">
                  Q{reservation.totalReservation}
                </td>

                <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                  <ReservationStatus status={reservation.status} />
                </td>

                <td className="px-2 py-4 text-center">
                  <ActionsMenu
                    items={[
                      {
                        label: "Ver reservación",
                        onClick: () => {
                          setSelectedReservationId(reservation.id);
                          setOpenReservationDetails(true);
                        },
                      },
                      {
                        label: "Editar",
                        onClick: () => {
                          setSelectedReservationId(reservation.id);
                          setOpenEditDialog(true);
                        },
                      },
                      {
                        label: "Registrar anticipo",
                        onClick: () => {
                          setSelectedReservationId(reservation.id);
                          setOpenDepositDialog(true);
                        },
                      },
                      {
                        label: "Cancelar reservación",
                        danger: true,
                        onClick: () => {
                          console.log("Cancelar reservación", reservation.id);
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}

            {filteredReservations.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron reservaciones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination page={page} totalPage={totalPage} onPageChange={setPage} />

      <CreateReservationDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      />

      {selectedReservationId && (
        <CreateReservationDeposit
          open={openDepositDialog}
          reservationId={selectedReservationId}
          onSuccess={() => {
            setRefreshReservations((prev) => prev + 1);
          }}
          onClose={() => {
            setOpenDepositDialog(false);
            setSelectedReservationId(null);
          }}
        />
      )}

      {selectedReservationId && (
        <GetReservationDetailsById
          id={selectedReservationId}
          open={openReservationDetails}
          onClose={() => {
            setOpenReservationDetails(false);
            setSelectedReservationId(null);
          }}
        />
      )}

      {selectedReservationId && (
        <EditReservationDialog
          open={openEditDialog}
          reservationId={selectedReservationId}
          onSuccess={() => {
            setRefreshReservations((prev) => prev + 1);
          }}
          onClose={() => {
            setOpenEditDialog(false);
            setSelectedReservationId(null);
          }}
        />
      )}
    </div>
  );
}
