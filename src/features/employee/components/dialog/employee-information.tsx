import { Employee } from "../../types/employee.types";
import { ROLES_LABELS } from "@/src/constants/roles";
import { StatusBadge } from "../ui/status-badge";

interface EmployeeInfoProps {
  employee: Employee;
}

export function EmployeeInformation({ employee }: EmployeeInfoProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div>
        <p className="text-sm font-medium text-gray-500">Nombre</p>
        <p className="mt-1 text-sm text-gray-900">
          {employee.firstName}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Segundo nombre</p>
        <p className="mt-1 text-sm text-gray-900">
          {employee.middleName || "—"}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Apellido</p>
        <p className="mt-1 text-sm text-gray-900">
          {employee.surname}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">
          Segundo apellido
        </p>
        <p className="mt-1 text-sm text-gray-900">
          {employee.secondSurname || "—"}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Email</p>
        <p className="mt-1 text-sm text-gray-900">
          {employee.email}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Teléfono</p>
        <p className="mt-1 text-sm text-gray-900">
          {employee.phoneNumber || "—"}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Rol</p>
        <p className="mt-1 text-sm text-gray-900">
          {ROLES_LABELS[employee.role] ?? employee.role}
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Estado</p>
        <p className="mt-1 text-sm text-gray-900">
           <StatusBadge variant={employee.status ? "active" : "inactive"}>
                {employee.status ? "ACTIVO" : "INACTIVO"}
           </StatusBadge>
        </p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">
          Fecha de contratación
        </p>
        <p className="mt-1 text-sm text-gray-900">
          {new Date(employee.hireDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}