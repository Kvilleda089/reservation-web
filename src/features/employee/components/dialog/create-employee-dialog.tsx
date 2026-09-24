import { useState } from "react";
import { toast } from "sonner";
import { Role, ROLES_LABELS } from "@/src/constants/roles";
import { Spinner } from "@/src/components/ui/spinner";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";
import { createEmployee } from "../../services/employee.service";
import { CreateEmployee } from "../../types/employee.types";

interface EmployeeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EmployeeCreateDialog({
  open,
  onOpenChange,
  onSuccess,
}: EmployeeCreateDialogProps) {
  const [form, setForm] = useState<CreateEmployee>({
    firstName: "",
    middleName: "",
    surname: "",
    secondSurname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "" as Role,
    hireDate: "",
  });

  const [saving, setSaving] = useState(false);

  if (!open) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);

      await createEmployee(form);

      toast.success("Empleado creado satisfactoriamente.");

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        `Ocurrió un error al crear el empleado, motivo: ${getApiErrorMessage(error)}`,
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Crear Nuevo Empleado
          </h2>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="text-xl text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
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
                  onChange={(e) =>
                    setForm({ ...form, middleName: e.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  value={form.surname}
                  onChange={(e) =>
                    setForm({ ...form, surname: e.target.value })
                  }
                  required
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
                    setForm({
                      ...form,
                      secondSurname: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phoneNumber: e.target.value,
                    })
                  }
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as Role,
                    })
                  }
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Seleccione un rol</option>

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
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hireDate: e.target.value,
                    })
                  }
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-5">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={saving}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Spinner className="mr-2 h-5 w-5" />
                    Creando empleado...
                  </>
                ) : (
                  "Crear empleado"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}