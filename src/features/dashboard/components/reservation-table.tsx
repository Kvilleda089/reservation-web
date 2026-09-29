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
import { useAuth } from "@/src/features/auth/context/auth.context";
import { can } from "@/src/lib/auth/helper/permissions.helper";
import { PERMISSIONS } from "@/src/constants/permissions";
import { Field, Select, TextInput } from "@/src/components/ui/form-field";
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableContainer,
  TableEmptyRow,
  TableHead,
  TableRow,
  TableScroll,
  Td,
  Th,
} from "@/src/components/ui/table";

export function ReservationTable() {
  //validación permisos:
  const { employee } = useAuth();

  const canCreate =
    !!employee && can(employee.role, PERMISSIONS.RESERVATIONS_CREATE);
  const canUpdate =
    !!employee && can(employee.role, PERMISSIONS.RESERVATIONS_UPDATE);
  const canCancel =
    !!employee && can(employee.role, PERMISSIONS.RESERVATIONS_CANCEL);

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
    const nextFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value.trim() !== ""),
    );

    setPage(1);

    setAppliedFilters(
      Object.keys(nextFilters).length > 0
        ? (nextFilters as typeof filters)
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
    <TableContainer>
      {/* Filtros */}
      <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-4 md:grid-cols-2 lg:grid-cols-4">
        <Field label="Fecha">
          <TextInput
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
          />
        </Field>

        <Field label="Cliente">
          <TextInput
            type="text"
            placeholder="Buscar cliente..."
            value={filters.client}
            onChange={(e) => handleFilterChange("client", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </Field>

        <Field label="Hora">
          <TextInput
            type="time"
            value={filters.hour}
            onChange={(e) => handleFilterChange("hour", e.target.value)}
          />
        </Field>

        <Field label="Estado">
          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="CONFIRMADA">Confirmada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="FINALIZADA">Finalizada</option>
          </Select>
        </Field>
      </div>

      {/* Acciones de filtros */}
      <div className="flex flex-col gap-2 border-b border-gray-200 p-4 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={handleClearFilters}>
          Limpiar
        </Button>

        <Button onClick={handleSearch}>Buscar</Button>
      </div>

      {/* Crear reservación */}
      <div className="my-4 flex justify-end px-4">
        {canCreate && (
          <Button onClick={() => setOpenCreateDialog(true)}>
            <Plus size={18} />
            Crear Nueva Reserva
          </Button>
        )}
      </div>

      {/* Tabla */}
      <TableScroll>
        <Table>
          <TableHead>
            <tr>
              <Th className="hidden whitespace-nowrap md:table-cell">
                Fecha
              </Th>

              <Th>Cliente</Th>

              <Th className="hidden sm:table-cell">Recurso</Th>

              <Th className="whitespace-nowrap">Hora</Th>

              <Th className="hidden whitespace-nowrap lg:table-cell">
                Horas
              </Th>

              <Th className="whitespace-nowrap">Total</Th>

              <Th>Estado</Th>

              <Th className="w-12 px-2 text-center">
                <span className="sr-only">Acciones</span>
              </Th>
            </tr>
          </TableHead>

          <TableBody>
            {reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                {/* Fecha */}
                <Td className="hidden whitespace-nowrap md:table-cell">
                  {formatDate(reservation.reservationDate)}
                </Td>

                {/* Cliente */}
                <Td className="max-w-0">
                  <div
                    className="break-words"
                    title={`${reservation.client.firstName} ${reservation.client.surname} ${reservation.client.secondSurname}`}
                  >
                    {reservation.client.firstName}{" "}
                    {reservation.client.surname}{" "}
                    {reservation.client.secondSurname}
                  </div>
                </Td>

                {/* Recurso */}
                <Td className="hidden sm:table-cell">
                  <div className="truncate">
                    {RESOURCE_LABELS[reservation.reservationResource] ??
                      reservation.reservationResource}
                  </div>
                </Td>

                {/* Hora */}
                <Td className="whitespace-nowrap">
                  {formatHour(reservation.hour)}
                </Td>

                {/* Horas */}
                <Td className="hidden whitespace-nowrap lg:table-cell">
                  {reservation.reservedHours}
                </Td>

                {/* Total */}
                <Td className="whitespace-nowrap">
                  Q{reservation.totalReservation}
                </Td>

                {/* Estado */}
                <Td className="whitespace-nowrap">
                  <ReservationStatus status={reservation.status} />
                </Td>

                {/* Acciones */}
                <Td className="px-2 text-center">
                  <ActionsMenu
                    items={[
                      {
                        label: "Ver reservación",
                        onClick: () => {
                          setSelectedReservationId(reservation.id);
                          setOpenReservationDetails(true);
                        },
                      },
                      ...(canUpdate
                        ? [
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
                          ]
                        : []),
                      ...(canCancel
                        ? [
                            {
                              label: "Cancelar reservación",
                              danger: true,
                              onClick: () =>
                                handleCancelReservation(reservation.id),
                            },
                          ]
                        : []),
                    ]}
                  />
                </Td>
              </TableRow>
            ))}

            {/* Sin resultados */}
            {reservations.length === 0 && (
              <TableEmptyRow colSpan={8}>
                No se encontraron reservaciones.
              </TableEmptyRow>
            )}
          </TableBody>
        </Table>
      </TableScroll>

      {/* Paginación */}
      <Pagination page={page} totalPage={totalPage} onPageChange={setPage} />

      {/* Crear reservación */}
      <CreateReservationDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          setRefreshReservations((prev) => prev + 1);
        }}
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
    </TableContainer>
  );
}