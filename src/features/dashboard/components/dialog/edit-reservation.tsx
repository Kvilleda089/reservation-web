import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getReservationById,
  updateReservationId,
} from "../../services/reservation.service";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";

interface EditReservationDialogProps {
  open: boolean;
  reservationId: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditReservationDialog({
  open,
  reservationId,
  onClose,
  onSuccess,
}: EditReservationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [loadingReservation, setLoadingReservation] = useState(false);

  const [form, setForm] = useState({
    reservationResource: "",
    reservationDate: "",
    hour: "",
    reservedHours: 1,
    totalReservation: 0,
  });

  /**
   * Obtener información actual de la reservación
   */
  useEffect(() => {
    if (!open || !reservationId) return;

    const loadReservation = async () => {
      try {
        setLoadingReservation(true);

        const response = await getReservationById(reservationId);
        const reservation = response.data;

        setForm({
          reservationResource: reservation.reservationResource,
          reservationDate: reservation.reservationDate.split("T")[0],
          hour: reservation.hour.includes("T")
            ? reservation.hour.split("T")[1].substring(0, 5)
            : reservation.hour.substring(0, 5),
          reservedHours: reservation.reservedHours,
          totalReservation: Number(reservation.totalReservation),
        });
      } catch (error) {
        console.error("Error obteniendo reservación:", error);
        toast.error("No se pudo obtener la información de la reservación");
        onClose();
      } finally {
        setLoadingReservation(false);
      }
    };

    loadReservation();
  }, [open, reservationId]);

  /**
   * Actualizar reservación
   */
  const handleSubmit = async () => {
    if (!reservationId) return;

    const dataUpdate = {
      reservationResource: form.reservationResource,
      reservationDate: form.reservationDate,
      hour: form.hour,
      reservedHours: form.reservedHours,
      totalReservation: form.totalReservation,
    };

    try {
      setLoading(true);

      await updateReservationId(reservationId, dataUpdate);

      toast.success("Reservación actualizada correctamente");

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error actualizando reservación:", error);
      toast.error(
        `No se pudo actualizar la reservación, motivo: ${getApiErrorMessage(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open || !reservationId) {
    return null;
  }

  const isLoading = loading || loadingReservation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Editar reservación
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Modifica los datos de la reservación.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Cerrar
          </button>
        </div>

        {/* Loading */}
        {loadingReservation ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />

            <span className="ml-3 text-sm text-gray-500">
              Cargando reservación...
            </span>
          </div>
        ) : (
          <>
            {/* Formulario */}
            <div className="mt-6 space-y-4">
              {/* Recurso */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Recurso
                </label>

                <select
                  value={form.reservationResource}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      reservationResource: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                >
                  <option value="">Seleccionar recurso</option>
                  <option value="CANCHA_1">Cancha 1</option>
                  <option value="CANCHA_2">Cancha 2</option>
                  <option value="SALON">Salón</option>
                </select>
              </div>

              {/* Fecha */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Fecha
                </label>

                <input
                  type="date"
                  value={form.reservationDate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      reservationDate: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Hora */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Hora
                </label>

                <input
                  type="time"
                  value={form.hour}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      hour: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>

              {/* Horas */}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Horas de reservación
                </label>

                <input
                  type="number"
                  min={1}
                  value={form.reservedHours}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      reservedHours: Number(e.target.value),
                    }))
                  }
                  disabled={isLoading}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Total de la reservación
              </label>

              <input
                type="number"
                min={0}
                step="0.01"
                value={form.totalReservation}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    totalReservation: Number(e.target.value),
                  }))
                }
                disabled={isLoading}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
              />
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
