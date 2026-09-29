"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import {
  ReservationResourceEnum,
  StatusReservationEnum,
} from "../../types/reservation-request";
import { createReservation } from "../../services/reservation.service";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";
import { Spinner } from "@/src/components/ui/spinner";
import { Modal } from "@/src/components/ui/modal";
import { Field, Select, TextInput } from "@/src/components/ui/form-field";
import { Button } from "@/src/components/ui/button";

type ReservationStatus = "PENDIENTE" | "CONFIRMADA";

interface CreateReservationDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
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
  onSuccess,
}: CreateReservationDialogProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [submitting, setSubmitting] = useState(false);

  const handleClientChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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

  const handleDepositChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          reservationResource: formData.reservation
            .reservationResource as ReservationResourceEnum,
          status: formData.reservation.status as StatusReservationEnum,
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
      onSuccess();

      toast.success(`Se ha creado la reservación exitosamente.`);
    } catch (error) {
      console.error("Error al crear la reservación:", error);
      toast.error(
        `Error al crear la reservación Motivo: ${getApiErrorMessage(error)}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Crear Nueva Reserva"
      description="Ingresa la información del cliente y de la reserva."
      closeDisabled={submitting}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-8 px-6 py-6">
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
            <Field label="Primer nombre" htmlFor="firstName">
              <TextInput
                id="firstName"
                type="text"
                name="firstName"
                value={formData.client.firstName}
                onChange={handleClientChange}
                required
                placeholder="Ej. María"
              />
            </Field>

            <Field label="Segundo nombre" htmlFor="middleName">
              <TextInput
                id="middleName"
                type="text"
                name="middleName"
                value={formData.client.middleName}
                onChange={handleClientChange}
                placeholder="Ej. Andrea"
              />
            </Field>

            <Field label="Apellido" htmlFor="surname">
              <TextInput
                id="surname"
                type="text"
                name="surname"
                value={formData.client.surname}
                onChange={handleClientChange}
                required
                placeholder="Ej. Hernández"
              />
            </Field>

            <Field label="Segundo apellido" htmlFor="secondSurname">
              <TextInput
                id="secondSurname"
                type="text"
                name="secondSurname"
                value={formData.client.secondSurname}
                onChange={handleClientChange}
                placeholder="Ej. Ramírez"
              />
            </Field>

            <Field label="Correo electrónico" htmlFor="email">
              <TextInput
                id="email"
                type="email"
                name="email"
                value={formData.client.email}
                onChange={handleClientChange}
                placeholder="cliente@email.com"
              />
            </Field>

            <Field label="Teléfono" htmlFor="phoneNumber">
              <TextInput
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={formData.client.phoneNumber}
                onChange={handleClientChange}
                placeholder="55591629"
              />
            </Field>

            <Field label="Fecha de registro" htmlFor="dateRegistration">
              <TextInput
                id="dateRegistration"
                type="date"
                name="dateRegistration"
                value={formData.client.dateRegistration}
                onChange={handleClientChange}
                required
              />
            </Field>
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
            <Field label="Fecha de reserva" htmlFor="reservationDate">
              <TextInput
                id="reservationDate"
                type="date"
                name="reservationDate"
                value={formData.reservation.reservationDate}
                onChange={handleReservationChange}
                required
              />
            </Field>

            <Field label="Hora" htmlFor="hour">
              <TextInput
                id="hour"
                type="time"
                name="hour"
                value={formData.reservation.hour}
                onChange={handleReservationChange}
                required
              />
            </Field>

            <Field label="Recurso" htmlFor="reservationResource">
              <Select
                id="reservationResource"
                name="reservationResource"
                value={formData.reservation.reservationResource}
                onChange={handleReservationChange}
                required
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

                <option value={ReservationResourceEnum.SALON}>Salón</option>
              </Select>
            </Field>

            <Field label="Horas reservadas" htmlFor="reservedHours">
              <TextInput
                id="reservedHours"
                type="number"
                name="reservedHours"
                min="1"
                value={formData.reservation.reservedHours}
                onChange={handleReservationChange}
                required
              />
            </Field>

            <Field label="Total de la reserva" htmlFor="totalReservation">
              <TextInput
                id="totalReservation"
                type="number"
                name="totalReservation"
                min="0"
                step="0.01"
                value={formData.reservation.totalReservation}
                onChange={handleReservationChange}
                required
                placeholder="0.00"
              />
            </Field>

            <Field label="Estado" htmlFor="status">
              <Select
                id="status"
                name="status"
                value={formData.reservation.status}
                onChange={handleReservationChange}
                required
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="CONFIRMADA">Confirmada</option>
              </Select>
            </Field>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Anticipo
            </h3>

            <p className="text-sm text-gray-500">
              Registra el anticipo recibido al momento de crear la reserva.
            </p>
          </div>

          <div className="max-w-sm">
            <Field label="Monto del anticipo" htmlFor="depositAmount">
              <TextInput
                id="depositAmount"
                type="number"
                name="depositAmount"
                min="0"
                step="0.01"
                value={formData.depositAmount}
                onChange={handleDepositChange}
                placeholder="0.00"
              />
            </Field>
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Creando...
              </>
            ) : (
              "Crear Reserva"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}