"use client";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { createReservationDeposit } from "../../services/reservation.service";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";

interface ReservationDepositProps {
  open: boolean;
  reservationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateReservationDeposit({
  open,
  onClose,
  reservationId,
  onSuccess,
}: ReservationDepositProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const depositAmoutn = Number(amount);

    if (!depositAmoutn || depositAmoutn <= 0) {
      setAmount("Ingrese un monto válido");
      return;
    }

    try {
      setLoading(true);

      await createReservationDeposit({
        amount: depositAmoutn,
        reservationId,
      });

      setAmount("");
      onSuccess();
      onClose();
      toast.success("Se realizado el deposito correcto en la reservación.");
    } catch (error) {
      console.error(error);
      setError("Ocurrió un error en registrar el anticipo. ");
      toast.error(
        `Ocurrio un error al registrar deposito, Motivo: ${getApiErrorMessage(error)}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Registrar anticipo
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-md p-2 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="amount"
                            className="mb-2 block text-sm font-medium"
                        >
                            Monto del anticipo
                        </label>

                        <input
                            id="amount"
                            type="number"
                            min="1"
                            step="0.01"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            placeholder="Ej. 400"
                            disabled={loading}
                            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-md border px-4 py-2"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
                        >
                            {loading ? "Registrando..." : "Registrar anticipo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
  );
}
