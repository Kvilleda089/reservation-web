import { ProtectedRoute } from "@/src/components/auth/protected.route";


export default function AgendaPage() {
  return (
<ProtectedRoute permission="agenda.read">
  <main>
    <h1>Empleados</h1>
    <p>Bienvenido a la agenda de ReservaFácil.</p>
  </main>
</ProtectedRoute>
  );
}

