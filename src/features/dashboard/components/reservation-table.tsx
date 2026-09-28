"use client";

import { useEffect, useState } from "react";

import { Plus } from "lucide-react";

import { Reservation } from "../types/reservation-response.type";

import {
  getReservation,
  updateReservationId,
} from "../services/reservation.service";

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
import { getApiErrorMessage } from "@/src/lib/errors/api-error";
import { toast } from "sonner";

export function ReservationTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [filters, setFilters] = useState({
    date: "",
    client: "",
    hour: "",
    status: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<
    typeof filters | undefined
  >(undefined);

  // Dialog crear reservación
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  // Dialog depósito
  const [openDepositDialog, setOpenDepositDialog] = useState(false);

  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

  // Dialog detalles
  const [openReservationDetails, setOpenReservationDetails] = useState(false);

  // Dialog edición
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [refreshReservations, setRefreshReservations] = useState(0);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);

        const response = await getReservation(page, limit, appliedFilters);

        setReservations(response.data);

        setTotalPage(Math.ceil(response.pagination.totalRecords / limit));
      } catch (error) {
        console.error("Error al obtener reservaciones:", error);

        toast.error(
          `No se pudieron obtener las reservaciones: ${getApiErrorMessage(error)}`,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [page, limit, appliedFilters, refreshReservations]);


  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const formatHour = (date: string) => {
    return date.split("T")[1].substring(0, 5);
  };

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const appliedFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value.trim() !== ""),
    );

    setPage(1);

    setAppliedFilters(
      Object.keys(appliedFilters).length > 0
        ? (appliedFilters as typeof filters)
        : undefined,
    );
  };

  /**
   * Limpiar filtros.
   */
  const handleClearFilters = () => {
    const emptyFilters = {
      date: "",
      client: "",
      hour: "",
      status: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(undefined);
    setPage(1);
  };

  const handleCancelReservation = (reservationId: string) => {
    toast("¿Está seguro que desea cancelar la reservación?", {
      action: {
        label: "Sí, cancelar",

        onClick: async () => {
          try {
            await updateReservationId(reservationId, {
              status: "CANCELADA",
            });

            toast.success("Reservación cancelada correctamente");

            setRefreshReservations((prev) => prev + 1);
          } catch (error) {
            console.error("Error cancelando reservación:", error);

            toast.error(
              `No se pudo cancelar la reservación, motivo: ${getApiErrorMessage(error)}`,
            );
          }
        },
      },

      cancel: {
        label: "No, regresar",
        onClick: () => {},
      },
    });
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Filtros */}
      <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Fecha */}
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

        {/* Cliente */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Cliente
          </label>

          <input
            type="text"
            placeholder="Buscar cliente..."
            value={filters.client}
            onChange={(e) => handleFilterChange("client", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        {/* Hora */}
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

        {/* Estado */}
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

      {/* Acciones de filtros */}
      <div className="flex justify-end gap-2 border-b border-gray-200 p-4">
        <button
          type="button"
          onClick={handleClearFilters}
          className="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Limpiar
        </button>

        <button
          type="button"
          onClick={handleSearch}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>

      {/* Crear reservación */}
      <div className="my-4 flex justify-end px-4">
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
            {reservations.map((reservation) => (
              <tr
                key={reservation.id}
                className="transition-colors hover:bg-gray-50"
              >
                {/* Fecha */}
                <td className="hidden whitespace-nowrap px-3 py-4 font-medium text-gray-900 md:table-cell lg:px-4">
                  {formatDate(reservation.reservationDate)}
                </td>

                {/* Cliente */}
                <td className="max-w-0 px-3 py-4 font-medium text-gray-900 lg:px-4">
                  <div
                    className="break-words"
                    title={`${reservation.client.firstName} ${reservation.client.surname} ${reservation.client.secondSurname}`}
                  >
                    {reservation.client.firstName} {reservation.client.surname}{" "}
                    {reservation.client.secondSurname}
                  </div>
                </td>

                {/* Recurso */}
                <td className="px-3 py-4 font-medium text-gray-900 lg:px-4">
                  <div className="truncate">
                    {RESOURCE_LABELS[reservation.reservationResource] ??
                      reservation.reservationResource}
                  </div>
                </td>

                {/* Hora */}
                <td className="whitespace-nowrap px-3 py-4 font-medium text-gray-900 lg:px-4">
                  {formatHour(reservation.hour)}
                </td>

                {/* Horas */}
                <td className="hidden whitespace-nowrap px-3 py-4 font-medium text-gray-900 sm:table-cell lg:px-4">
                  {reservation.reservedHours}
                </td>

                {/* Total */}
                <td className="whitespace-nowrap px-3 py-4 font-medium text-gray-900 lg:px-4">
                  Q{reservation.totalReservation}
                </td>

                {/* Estado */}
                <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                  <ReservationStatus status={reservation.status} />
                </td>

                {/* Acciones */}
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
                        onClick: () => handleCancelReservation(reservation.id),
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}

            {/* Sin resultados */}
            {reservations.length === 0 && (
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

      {/* Crear reservación */}
      <CreateReservationDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      />

      {/* Registrar depósito */}
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

      {/* Detalles */}
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

      {/* Editar */}
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
