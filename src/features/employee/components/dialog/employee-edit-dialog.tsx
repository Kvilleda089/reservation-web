import { useState } from "react";
import { Employee, UpdateEmployee } from "../../types/employee.types";
import { Role, ROLES_LABELS } from "@/src/constants/roles";
import { updateEmploye } from "../../services/employee.service";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/src/lib/errors/api-error";
import { Spinner } from "@/src/components/ui/spinner";
import { Field, Select, TextInput } from "@/src/components/ui/form-field";
import { Button } from "@/src/components/ui/button";

interface EmployeeEditProps {
  employee: Employee;
  onSuccess: () => void;
}

export function EmployeeEditDialog({ employee, onSuccess }: EmployeeEditProps) {
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
        <Field label="Nombre">
          <TextInput
            type="text"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />
        </Field>

        <Field label="Segundo nombre">
          <TextInput
            type="text"
            value={form.middleName}
            onChange={(e) => setForm({ ...form, middleName: e.target.value })}
          />
        </Field>

        <Field label="Apellido">
          <TextInput
            type="text"
            value={form.surname}
            onChange={(e) => setForm({ ...form, surname: e.target.value })}
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
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>

        <Field label="Teléfono">
          <TextInput
            type="text"
            value={form.phoneNumber}
            onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          />
        </Field>

        <Field label="Rol">
          <Select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as Role })
            }
          >
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
            onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Estado">
        <Select
          value={form.status ? "true" : "false"}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value === "true" })
          }
        >
          <option value="true">ACTIVO</option>
          <option value="false">INACTIVO</option>
        </Select>
      </Field>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Spinner className="mr-2 h-5 w-5" />
              Guardando cambios...
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </form>
  );
}