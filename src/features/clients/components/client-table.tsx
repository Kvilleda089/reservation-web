import { useEffect, useState } from "react";

import { ClientListResponse } from "../types/client.type";
import { getOneClient } from "../services/client.service";

import { toast } from "sonner";

import { StatusBadge } from "../../employee/components/ui/status-badge";

import { PageLoading } from "@/src/components/loading/page-loading";

import { HistoryReservationDialog } from "./dialog/history-reservation-dialog";

import { Pagination } from "@/src/components/pagination/pagination";
import { Client } from "../../dashboard/types/reservation-response.type";
import { Field, TextInput } from "@/src/components/ui/form-field";
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

export function ClientTable() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [filters, setFilters] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
  });

  const [searchFilters, setSearchFilters] = useState({
    firstName: "",
    email: "",
    phoneNumber: "",
  });

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const handleViewHistory = (client: Client) => {
    setSelectedClient(client);
    setHistoryOpen(true);
  };

  const handleFilterChange = (
    field: keyof typeof filters,
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    setPage(1);

    setSearchFilters({
      firstName: filters.firstName.trim(),
      email: filters.email.trim(),
      phoneNumber: filters.phoneNumber.trim(),
    });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);

        const response: ClientListResponse = await getOneClient({
          firstName: searchFilters.firstName || undefined,
          email: searchFilters.email || undefined,
          phoneNumber: searchFilters.phoneNumber || undefined,
          page,
          limit,
        });

        setClients(response.data);
        setTotalPage(response.pagination.lastPage);
      } catch (error) {
        console.log(error);

        toast.error("Lo sentimos ocurrió un error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [page, limit, searchFilters]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <TableContainer>
      {/* Filtros */}
      <div className="border-b border-gray-200 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field label="Nombre">
            <TextInput
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.firstName}
              onChange={(e) => handleFilterChange("firstName", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Field>

          <Field label="Email">
            <TextInput
              type="text"
              placeholder="Buscar por email..."
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Field>

          <Field label="Teléfono">
            <TextInput
              type="text"
              placeholder="Buscar por teléfono..."
              value={filters.phoneNumber}
              onChange={(e) => handleFilterChange("phoneNumber", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </Field>
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSearch}>Buscar</Button>
        </div>
      </div>

      <TableScroll>
        <Table>
          <TableHead>
            <tr>
              <Th>Nombre</Th>
              <Th className="hidden md:table-cell">Email</Th>
              <Th className="hidden sm:table-cell">Teléfono</Th>
              <Th className="hidden lg:table-cell">Fecha Registro</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </TableHead>

          <TableBody>
            {clients?.map((client) => (
              <TableRow key={client.id}>
                <Td className="max-w-0">
                  <div
                    className="break-words"
                    title={`${client.firstName} ${client.surname} ${client.secondSurname}`}
                  >
                    {client.firstName} {client.surname} {client.secondSurname}
                  </div>
                </Td>

                <Td className="hidden w-[25%] md:table-cell">
                  {client.email ?? "—"}
                </Td>

                <Td className="hidden w-[15%] whitespace-nowrap sm:table-cell">
                  {client.phoneNumber ?? "—"}
                </Td>

                <Td className="hidden whitespace-nowrap lg:table-cell">
                  {formatDate(client.dateRegistration)}
                </Td>

                <Td>
                  <StatusBadge
                    variant={client.status ? "active" : "inactive"}
                  >
                    {client.status ? "ACTIVO" : "INACTIVO"}
                  </StatusBadge>
                </Td>

                <Td className="whitespace-nowrap">
                  <button
                    type="button"
                    className="text-sm font-medium text-blue-600 hover:underline"
                    onClick={() => handleViewHistory(client)}
                  >
                    Ver historial
                  </button>
                </Td>
              </TableRow>
            ))}

            {clients?.length === 0 && (
              <TableEmptyRow colSpan={6}>
                No se encontraron clientes.
              </TableEmptyRow>
            )}
          </TableBody>
        </Table>
      </TableScroll>

      {/* Paginación */}
      <Pagination page={page} totalPage={totalPage} onPageChange={setPage} />

      {/* Historial */}
      {selectedClient && (
        <HistoryReservationDialog
          open={historyOpen}
          client={selectedClient}
          onClose={() => {
            setHistoryOpen(false);
            setSelectedClient(null);
          }}
        />
      )}
    </TableContainer>
  );
}