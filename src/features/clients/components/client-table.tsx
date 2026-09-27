import { useEffect, useState } from "react";

import {  ClientListResponse } from "../types/client.type";
import { getOneClient } from "../services/client.service";

import { toast } from "sonner";

import { StatusBadge } from "../../employee/components/ui/status-badge";

import { PageLoading } from "@/src/components/loading/page-loading";

import { HistoryReservationDialog } from "./dialog/history-reservation-dialog";

import { Pagination } from "@/src/components/pagination/pagination";
import { Client } from "../../dashboard/types/reservation-response.type";

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

        toast.error(
          "Lo sentimos ocurrió un error al obtener los datos.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClients();

  }, [
    page,
    limit,
    searchFilters,
  ]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Filtros */}
      <div className="border-b border-gray-200 p-4">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre
            </label>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.firstName}
              onChange={(e) =>
                handleFilterChange("firstName", e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="text"
              placeholder="Buscar por email..."
              value={filters.email}
              onChange={(e) =>
                handleFilterChange("email", e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Teléfono
            </label>

            <input
              type="text"
              placeholder="Buscar por teléfono..."
              value={filters.phoneNumber}
              onChange={(e) =>
                handleFilterChange("phoneNumber", e.target.value)
              }
              onKeyDown={handleKeyDown}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>

      </div>

      <table className="w-full table-auto text-left text-sm text-gray-600">

        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-3 py-4 font-semibold lg:px-4">
              Nombre
            </th>

            <th className="px-3 py-4 font-semibold lg:px-4">
              Email
            </th>

            <th className="px-3 py-4 font-semibold lg:px-4">
              Teléfono
            </th>

            <th className="px-3 py-4 font-semibold lg:px-4">
              Fecha Registro
            </th>

            <th className="px-3 py-4 font-semibold lg:px-4">
              Estado
            </th>

            <th className="px-3 py-4 font-semibold lg:px-4">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">

          {clients?.map((client) => (
            <tr
              key={client.id}
              className="transition-colors hover:bg-gray-50"
            >

              <td className="px-3 py-4 font-medium text-gray-900 lg:px-4">
                <div
                  className="break-words"
                  title={`${client.firstName} ${client.surname} ${client.secondSurname}`}
                >
                  {client.firstName} {client.surname} {client.secondSurname}
                </div>
              </td>

              <td className="w-[25%] px-3 py-4 font-medium text-gray-900 lg:px-4">
                {client.email ?? "—"}
              </td>

              <td className="w-[15%] px-3 py-4 font-medium text-gray-900 lg:px-4">
                {client.phoneNumber ?? "—"}
              </td>

              <td className="px-3 py-4 font-medium text-gray-900 lg:px-4">
                {formatDate(client.dateRegistration)}
              </td>

              <td className="px-3 py-4 font-medium text-gray-900 lg:px-4">
                <StatusBadge
                  variant={client.status ? "active" : "inactive"}
                >
                  {client.status ? "ACTIVO" : "INACTIVO"}
                </StatusBadge>
              </td>

              <td className="px-3 py-4 lg:px-4">
                <button
                  type="button"
                  className="text-sm font-medium text-blue-600 hover:underline"
                  onClick={() => handleViewHistory(client)}
                >
                  Ver historial
                </button>
              </td>

            </tr>
          ))}

        </tbody>
      </table>

      <HistoryReservationDialog
        open={historyOpen}
        client={selectedClient}
        onClose={() => setHistoryOpen(false)}
      />

      <Pagination
        page={page}
        totalPage={totalPage}
        onPageChange={setPage}
      />

    </div>
  );
}