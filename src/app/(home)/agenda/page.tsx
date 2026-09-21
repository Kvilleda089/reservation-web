import { ProtectedRoute } from "@/src/components/auth/protected.route";
import { AgendaView } from "@/src/features/agenda/components/agenda-view";


export default function AgendaPage() {
  return (
<ProtectedRoute permission="agenda.read">
  <main>
    <AgendaView/>
  </main>
</ProtectedRoute>
  );
}

