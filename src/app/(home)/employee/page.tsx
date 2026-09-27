import { ProtectedRoute } from "@/src/components/auth/protected.route";
import { EmployeeTable } from "@/src/features/employee/components/employee-table.view";


export default function AgendaPage() {
  return (
<ProtectedRoute permission="employeess.read">
  <main>
    <EmployeeTable/>
  </main>
</ProtectedRoute>
  );
}

