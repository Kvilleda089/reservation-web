type ReservationStatusProps = {
  status: string;
};

export function ReservationStatus({ status }: ReservationStatusProps) {
  const styles = {
    PENDIENTE: "bg-yellow-100 text-yellow-700",
    CONFIRMADA: "bg-green-100 text-green-700",
    CANCELADA: "bg-red-100 text-red-700",
    FINALIZADA: "bg-blue-100 text-blue-700",
  };

  const labels = {
    PENDIENTE: "Pendiente",
    CONFIRMADA: "Confirmada",
    CANCELADA: "Cancelada",
    FINALIZADA: "Finalizada",
  };

  const statusStyle =
    styles[status as keyof typeof styles] ?? "bg-gray-100 text-gray-700";

  const statusLabel = labels[status as keyof typeof labels] ?? status;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyle}`}
    >
      {statusLabel}
    </span>
  );
}
