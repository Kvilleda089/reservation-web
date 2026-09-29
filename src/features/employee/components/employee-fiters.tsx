"use client";

import { Role } from "@/src/constants/roles";
import { GetOneEmployeeFilters } from "../types/employee.types";
import { Field, Select, TextInput } from "@/src/components/ui/form-field";
import { Button } from "@/src/components/ui/button";

interface EmployeeFiltersProps {
  filters: GetOneEmployeeFilters;
  onChange: (filters: GetOneEmployeeFilters) => void;
  onSearch: () => void;
  onClear: () => void;
}

export function EmployeeFilters({
  filters,
  onChange,
  onSearch,
  onClear,
}: EmployeeFiltersProps) {
  const handleChange = (
    field: keyof GetOneEmployeeFilters,
    value: string,
  ) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Field label="Nombre">
          <TextInput
            type="text"
            placeholder="Buscar por nombre"
            value={filters.firstName ?? ""}
            onChange={(event) => handleChange("firstName", event.target.value)}
          />
        </Field>

        <Field label="Usuario">
          <TextInput
            type="text"
            placeholder="Buscar por usuario"
            value={filters.username ?? ""}
            onChange={(event) => handleChange("username", event.target.value)}
          />
        </Field>

        <Field label="Email">
          <TextInput
            type="email"
            placeholder="Buscar por email"
            value={filters.email ?? ""}
            onChange={(event) => handleChange("email", event.target.value)}
          />
        </Field>

        <Field label="Rol">
          <Select
            value={filters.role ?? "ALL"}
            onChange={(event) =>
              onChange({
                ...filters,
                role:
                  event.target.value === "ALL"
                    ? undefined
                    : (event.target.value as Role),
              })
            }
          >
            <option value="ALL">Todos</option>
            <option value="SUPER_ADMINISTRATOR">Super Administrador</option>
            <option value="ADMINISTRATOR">Administrador</option>
            <option value="COURT_MANAGER">Encargado de Cancha</option>
            <option value="CLEANING_STAFF">Personal de Limpieza</option>
            <option value="RECEPTIONIST">Recepcionista</option>
          </Select>
        </Field>

        <Field label="Estado">
          <Select
            value={
              filters.status === undefined
                ? "ALL"
                : filters.status
                  ? "ACTIVE"
                  : "INACTIVE"
            }
            onChange={(event) =>
              onChange({
                ...filters,
                status:
                  event.target.value === "ALL"
                    ? undefined
                    : event.target.value === "ACTIVE",
              })
            }
          >
            <option value="ALL">Todos</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </Select>
        </Field>
      </div>

      {/* Acciones */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={onClear}>
          Limpiar
        </Button>

        <Button onClick={onSearch}>Buscar</Button>
      </div>
    </div>
  );
}