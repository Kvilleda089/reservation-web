import { ProtectedRoute } from "@/src/components/auth/protected.route";
import { EmployeeTable } from "@/src/features/employee/components/employee-table.view";


export default function EmployeePage() {
  return (
<ProtectedRoute permission="employees.read">
  <main>
    <EmployeeTable/>
  </main>
</ProtectedRoute>
  );
}

