import { useState } from "react";
import { toast } from "sonner";
import { Role, ROLES_LABELS } from "@/src/constants/roles";
import { Spinner } from "@/src/components/ui/spinner";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";
import { createEmployee } from "../../services/employee.service";
import { CreateEmployee } from "../../types/employee.types";
import { Modal } from "@/src/components/ui/modal";
import { Field, Select, TextInput } from "@/src/components/ui/form-field";
import { Button } from "@/src/components/ui/button";

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
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title="Crear Nuevo Empleado"
      closeDisabled={saving}
      size="lg"
    >
      <div className="px-6 py-5">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre">
              <TextInput
                type="text"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
              />
            </Field>

            <Field label="Segundo nombre">
              <TextInput
                type="text"
                value={form.middleName}
                onChange={(e) =>
                  setForm({ ...form, middleName: e.target.value })
                }
              />
            </Field>

            <Field label="Apellido">
              <TextInput
                type="text"
                value={form.surname}
                onChange={(e) =>
                  setForm({ ...form, surname: e.target.value })
                }
                required
              />
            </Field>

            <Field label="Segundo apellido">
              <TextInput
                type="text"
                value={form.secondSurname}
                onChange={(e) =>
                  setForm({ ...form, secondSurname: e.target.value })
                }
              />
            </Field>

            <Field label="Email">
              <TextInput
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </Field>

            <Field label="Teléfono">
              <TextInput
                type="text"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                required
              />
            </Field>

            <Field label="Contraseña">
              <TextInput
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </Field>

            <Field label="Rol">
              <Select
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as Role })
                }
                required
              >
                <option value="">Seleccione un rol</option>

                {Object.entries(ROLES_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Fecha de contratación">
              <TextInput
                type="date"
                value={form.hireDate}
                onChange={(e) =>
                  setForm({ ...form, hireDate: e.target.value })
                }
                required
              />
            </Field>
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Spinner className="mr-2 h-5 w-5" />
                  Creando empleado...
                </>
              ) : (
                "Crear empleado"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}