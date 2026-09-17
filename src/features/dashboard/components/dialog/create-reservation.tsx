"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";
import { ReservationResourceEnum, StatusReservationEnum } from "../../types/reservation-request";
import { createReservation } from "../../services/reservation.service";



type ReservationStatus = "PENDIENTE" | "CONFIRMADA";

interface CreateReservationDialogProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  client: {
    firstName: string;
    middleName: string;
    surname: string;
    secondSurname: string;
    email: string;
    dateRegistration: string;
    phoneNumber: string;
  };

  reservation: {
    hour: string;
    reservationDate: string;
    reservationResource: string;
    status: ReservationStatus;
    reservedHours: number;
    totalReservation: number;
  };

  depositAmount: number;
}

const initialFormData: FormData = {
  client: {
    firstName: "",
    middleName: "",
    surname: "",
    secondSurname: "",
    email: "",
    dateRegistration: new Date().toISOString().split("T")[0],
    phoneNumber: "",
  },

  reservation: {
    hour: "",
    reservationDate: "",
    reservationResource: "",
    status: "PENDIENTE",
    reservedHours: 1,
    totalReservation: 0,
  },

  depositAmount: 0,
};

export function CreateReservationDialog({
  open,
  onClose,
}: CreateReservationDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [submitting, setSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  const handleClientChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      client: {
        ...current.client,
        [name]: value,
      },
    }));
  };

  const handleReservationChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      reservation: {
        ...current.reservation,
        [name]:
          name === "reservedHours" || name === "totalReservation"
            ? Number(value)
            : value,
      },
    }));
  };

  const handleDepositChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFormData((current) => ({
      ...current,
      depositAmount: Number(event.target.value),
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      const request = {
        client: {
          firstName: formData.client.firstName,
          middleName: formData.client.middleName || undefined,
          surname: formData.client.surname,
          secondSurname: formData.client.secondSurname,
          email: formData.client.email || undefined,
          dateRegistration: formData.client.dateRegistration,
          phoneNumber: formData.client.phoneNumber || undefined,
        },

        reservation: {
          hour: formData.reservation.hour,
          reservationDate: formData.reservation.reservationDate,
          reservationResource:
            formData.reservation.reservationResource as ReservationResourceEnum,
          status:
            formData.reservation.status as StatusReservationEnum,
          reservedHours: formData.reservation.reservedHours,
          totalReservation: formData.reservation.totalReservation,
        },

        ...(formData.depositAmount > 0 && {
          deposit: {
            amount: formData.depositAmount,
          },
        }),
      };

      await createReservation(request);

      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error("Error al crear la reservación:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Crear Nueva Reserva
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Ingresa la información del cliente y de la reserva.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 px-6 py-6"
        >

          {/* ============================= */}
          {/* CLIENTE */}
          {/* ============================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                Información del cliente
              </h3>

              <p className="text-sm text-gray-500">
                Datos personales y de contacto del cliente.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Primer nombre
                </label>

                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.client.firstName}
                  onChange={handleClientChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Ej. María"
                />
              </div>

            
              <div>
                <label
                  htmlFor="middleName"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Segundo nombre
                </label>

                <input
                  id="middleName"
                  type="text"
                  name="middleName"
                  value={formData.client.middleName}
                  onChange={handleClientChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Ej. Andrea"
                />
              </div>

              <div>
                <label
                  htmlFor="surname"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Apellido
                </label>

                <input
                  id="surname"
                  type="text"
                  name="surname"
                  value={formData.client.surname}
                  onChange={handleClientChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Ej. Hernández"
                />
              </div>

             
              <div>
                <label
                  htmlFor="secondSurname"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Segundo apellido
                </label>

                <input
                  id="secondSurname"
                  type="text"
                  name="secondSurname"
                  value={formData.client.secondSurname}
                  onChange={handleClientChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Ej. Ramírez"
                />
              </div>

              
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Correo electrónico
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.client.email}
                  onChange={handleClientChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="cliente@email.com"
                />
              </div>

            
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Teléfono
                </label>

                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.client.phoneNumber}
                  onChange={handleClientChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="55591629"
                />
              </div>

           
              <div>
                <label
                  htmlFor="dateRegistration"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Fecha de registro
                </label>

                <input
                  id="dateRegistration"
                  type="date"
                  name="dateRegistration"
                  value={formData.client.dateRegistration}
                  onChange={handleClientChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </section>

          {/* ============================= */}
          {/* RESERVACIÓN */}
          {/* ============================= */}

          <section>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                Información de la reserva
              </h3>

              <p className="text-sm text-gray-500">
                Define los detalles de la reservación.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

       
              <div>
                <label
                  htmlFor="reservationDate"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Fecha de reserva
                </label>

                <input
                  id="reservationDate"
                  type="date"
                  name="reservationDate"
                  value={formData.reservation.reservationDate}
                  onChange={handleReservationChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

         
              <div>
                <label
                  htmlFor="hour"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Hora
                </label>

                <input
                  id="hour"
                  type="time"
                  name="hour"
                  value={formData.reservation.hour}
                  onChange={handleReservationChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

             
              <div>
                <label
                  htmlFor="reservationResource"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Recurso
                </label>

                <select
                  id="reservationResource"
                  name="reservationResource"
                  value={formData.reservation.reservationResource}
                  onChange={handleReservationChange}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Seleccionar recurso
                  </option>

                  <option value={ReservationResourceEnum.CANCHA_1}>
                    Cancha 1
                  </option>

                  <option value={ReservationResourceEnum.CANCHA_2}>
                    Cancha 2
                  </option>

                  <option value={ReservationResourceEnum.SALON}>
                    Salón
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="reservedHours"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Horas reservadas
                </label>

                <input
                  id="reservedHours"
                  type="number"
                  name="reservedHours"
                  min="1"
                  value={formData.reservation.reservedHours}
                  onChange={handleReservationChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="totalReservation"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Total de la reserva
                </label>

                <input
                  id="totalReservation"
                  type="number"
                  name="totalReservation"
                  min="0"
                  step="0.01"
                  value={formData.reservation.totalReservation}
                  onChange={handleReservationChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              
              <div>
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Estado
                </label>

                <select
                  id="status"
                  name="status"
                  value={formData.reservation.status}
                  onChange={handleReservationChange}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="PENDIENTE">
                    Pendiente
                  </option>

                  <option value="CONFIRMADA">
                    Confirmada
                  </option>
                </select>
              </div>
            </div>
          </section>


          <section>
            <div className="mb-4">
              <h3 className="text-base font-semibold text-gray-900">
                Anticipo
              </h3>

              <p className="text-sm text-gray-500">
                Registra el anticipo recibido al momento de crear
                la reserva.
              </p>
            </div>

            <div className="max-w-sm">
              <label
                htmlFor="depositAmount"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Monto del anticipo
              </label>

              <input
                id="depositAmount"
                type="number"
                name="depositAmount"
                min="0"
                step="0.01"
                value={formData.depositAmount}
                onChange={handleDepositChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </section>


          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Creando..."
                : "Crear Reserva"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}