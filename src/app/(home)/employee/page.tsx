import { ProtectedRoute } from "@/src/components/auth/protected.route";
import { EmployeeTable } from "@/src/features/employee/components/employee-table.view";


export default function AgendaPage() {
  return (
<ProtectedRoute permission="agenda.read">
  <main>
    <EmployeeTable/>
  </main>
</ProtectedRoute>
  );
}

