import { useState } from "react";
import { Employee, UpdateEmployee } from "../../types/employee.types";
import { Role, ROLES_LABELS } from "@/src/constants/roles";
import { updateEmploye } from "../../services/employee.service";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";
import { Spinner } from "@/src/components/ui/spinner";

interface EmployeeEditProps {
  employee: Employee;
  onSuccess: () => void;
}

export function EmployeeEditDialog({ employee, onSuccess}: EmployeeEditProps) {
  const [form, setForm] = useState({
    firstName: employee.firstName,
    middleName: employee.middleName,
    surname: employee.surname,
    secondSurname: employee.secondSurname,
    email: employee.email,
    phoneNumber: employee.phoneNumber ?? "",
    role: employee.role,
    hireDate: employee.hireDate.split("T")[0],
    status: employee.status,
  });

  const [saving, setSaving] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);
      const dataUpdate: UpdateEmployee = {
        firstName: form.firstName,
        middleName: form.middleName,
        surname: form.surname,
        secondSurname: form.secondSurname,
        email: form.email,
        phoneNumber: form.phoneNumber,
        role: form.role,
        hireDate: form.hireDate,
        status: form.status,
      };

      await updateEmploye(employee.id, dataUpdate);

      toast.success(`Se realizado la actualización satisfactoriamente.`);
      onSuccess();
     
    } catch (error) {
      toast.error(
        `Ocurrió un error al actualizar, motivo: ${getApiErrorMessage(error)}`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Segundo nombre
          </label>
          <input
            type="text"
            value={form.middleName}
            onChange={(e) => setForm({ ...form, middleName: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            value={form.surname}
            onChange={(e) => setForm({ ...form, surname: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Segundo apellido
          </label>
          <input
            type="text"
            value={form.secondSurname}
            onChange={(e) =>
              setForm({ ...form, secondSurname: e.target.value })
            }
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Rol</label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value as Role,
              })
            }
            className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            {Object.entries(ROLES_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Fecha de contratación
          </label>
          <input
            type="date"
            value={form.hireDate}
            onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Estado</label>

        <select
          value={form.status ? "true" : "false"}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value === "true",
            })
          }
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
        >
          <option value="true">ACTIVO</option>
          <option value="false">INACTIVO</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving  ? (
            <>
              <Spinner className="mr-2 h-5 w-5" />
              Guardando cambios...
            </>
          ) : (
            "Guardar"
          )}
        </button>
      </div>
    </form>
  );
}
