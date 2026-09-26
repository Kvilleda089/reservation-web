import { use, useEffect, useEffectEvent, useState } from "react";
import { Client, ClientListResponse } from "../types/client.type";
import { getAllClientsList } from "../services/client.service";
import { toast } from "sonner";
import { StatusBadge } from "../../employee/components/ui/status-badge";
import { PageLoading } from "@/src/components/loading/page-loading";
import { HistoryReservationDialog } from "./dialog/history-reservation-dialog";

export function ClientTable() {
  const [clients, setClients] = useState<Client[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const handleViewHistory = (client: Client) => {
    setSelectedClient(client);
    setHistoryOpen(true);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const response: ClientListResponse = await getAllClientsList(
          page,
          limit,
        );

        setClients(response.data);
        console.log(response.data);
        setTotalPage(response.pagination.lastPage);
      } catch (error) {
        console.log(error);
        toast.error(`Lo sentimos ocurrió un error al obtener los datos. `);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [page, limit]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full table-auto text-left text-sm text-gray-600">
        <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-3 py-4 font-semibold lg:px-4">Nombre</th>
            <th className="px-3 py-4 font-semibold lg:px-4">Email</th>
            <th className="px-3 py-4 font-semibold lg:px-4">Teléfono</th>
            <th className="px-3 py-4 font-semibold lg:px-4">Fecha Registro</th>
            <th className="px-3 py-4 font-semibold lg:px-4">Estado</th>
            <th className="px-3 py-4 font-semibold lg:px-4">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {clients?.map((client) => (
            <tr key={client.id} className="transition-colors hover:bg-gray-50">
              {/**Full name */}
              <td className=" px-3 py-4 font-medium text-gray-900 lg:px-4">
                <div
                  className="break-words"
                  title={`${client.firstName} ${client.surname} ${client.secondSurname}`}
                >
                  {client.firstName} {client.surname} {client.secondSurname}
                </div>
              </td>

              {/**Email */}
              <td className="w-[25%] px-3 py-4 font-medium text-gray-900 lg:px-4">
                {client.email ?? "—"}
              </td>

              {/**PhoneNumber */}
              <td className="w-[15%] px-3 py-4 font-medium text-gray-900 lg:px-4">
                {client.phoneNumber ?? "—"}
              </td>

              {/**Date Register */}
              <td className="px-3 py-4 font-medium text-gray-900 lg:px-4">
                {formatDate(client.dateRegistration)}
              </td>

              {/**State */}
              <td className="px-3 py-4 font-medium text-gray-900 lg:px-4">
                <StatusBadge variant={client.status ? "active" : "inactive"}>
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

      {/**Dialog */}
      <HistoryReservationDialog
        open={historyOpen}
        client={selectedClient}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}
