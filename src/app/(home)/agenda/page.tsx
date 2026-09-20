import { ProtectedRoute } from "@/src/components/auth/protected.route";


export default function AgendaPage() {
  return (
<ProtectedRoute permission="agenda.read">
  <main>
    <h1>Agenda</h1>
    <p>Bienvenido a la agenda de ReservaFácil.</p>
  </main>
</ProtectedRoute>
  );
}

