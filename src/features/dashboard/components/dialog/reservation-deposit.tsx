"use client";
import { useState } from "react";
import { toast } from "sonner";
import { createReservationDeposit } from "../../services/reservation.service";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";
import { Spinner } from "@/src/components/ui/spinner";
import { Modal, ModalFooter } from "@/src/components/ui/modal";
import { Field, TextInput } from "@/src/components/ui/form-field";
import { Button } from "@/src/components/ui/button";

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const depositAmoutn = Number(amount);

    if (!depositAmoutn || depositAmoutn <= 0) {
      setError("Ingrese un monto válido");
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
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar anticipo"
      closeDisabled={loading}
    >
      <form onSubmit={handleSubmit} className="space-y-5 p-6">
        <Field label="Monto del anticipo">
          <TextInput
            id="amount"
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Ej. 400"
            disabled={loading}
          />
        </Field>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <ModalFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>

          <Button type="submit" variant="dark" disabled={loading}>
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Registrando...
              </>
            ) : (
              "Registrar anticipo"
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}