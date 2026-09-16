import { useEffect, useState } from "react";

import { Reservation } from "../types/reservation-response.type";
import { getReservation } from "../services/reservation.service";

import { ReservationStatus } from "./reservation-status";
import { ActionsMenu } from "./action-menu";

export function ReservationTable() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getReservation(1, 10);
        setReservations(response.data);
      } catch (error) {
        console.error("Error al obtener reservaciones: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) {
    return <p>Cargando Reservaciones...</p>;
  }

  const formatDate = (date: string) => {
    return date.split("T")[0];
  };

  const formatHour = (date: string) => {
    return date.split("T")[1].substring(0, 5);
  };

  return (
    <div className="w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="w-full">
        <table className="w-full table-auto text-left text-sm text-gray-600">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
      
              <th className="hidden whitespace-nowrap px-3 py-4 font-semibold md:table-cell lg:px-4">
                Fecha
              </th>

              <th className="px-3 py-4 font-semibold lg:px-4">
                Cliente
              </th>

             
              <th className="px-3 py-4 font-semibold lg:px-4">
                Recurso
              </th>

             
              <th className="whitespace-nowrap px-3 py-4 font-semibold lg:px-4">
                Hora
              </th>

             
              <th className="hidden whitespace-nowrap px-3 py-4 font-semibold sm:table-cell lg:px-4">
                Horas
              </th>

             
              <th className="whitespace-nowrap px-3 py-4 font-semibold lg:px-4">
                Total
              </th>

            
              <th className="px-3 py-4 font-semibold lg:px-4">
                Estado
              </th>

              
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
              
                <td className="hidden whitespace-nowrap px-3 py-4 font-medium text-gray-900 md:table-cell lg:px-4">
                  {formatDate(reservation.reservationDate)}
                </td>

                
                <td className="max-w-0 px-3 py-4 font-medium text-gray-900 lg:px-4">
                  <div
                    className="break-words"
                    title={`${reservation.client.firstName} ${reservation.client.surname} ${reservation.client.secondSurname}`}
                  >
                    {reservation.client.firstName}{" "}
                    {reservation.client.surname}{" "}
                    {reservation.client.secondSurname}
                  </div>
                </td>

               
                <td className="px-3 py-4 font-medium text-gray-900 lg:px-4">
                  <div className="truncate">
                    {reservation.reservationResource}
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
                          console.log(
                            "Ver reservación",
                            reservation.id,
                          );
                        },
                      },
                      {
                        label: "Editar",
                        onClick: () => {
                          console.log(
                            "Editar",
                            reservation.id,
                          );
                        },
                      },
                      {
                        label: "Registrar anticipo",
                        onClick: () => {
                          console.log(
                            "Registrar anticipo",
                            reservation.id,
                          );
                        },
                      },
                      {
                        label: "Cancelar reservación",
                        danger: true,
                        onClick: () => {
                          console.log(
                            "Cancelar reservación",
                            reservation.id,
                          );
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}