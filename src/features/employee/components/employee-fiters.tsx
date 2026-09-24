"use client";

import { Role } from "@/src/constants/roles";
import { GetOneEmployeeFilters } from "../types/employee.types";

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
        {/* Nombre */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Nombre
          </label>

          <input
            type="text"
            placeholder="Buscar por nombre"
            value={filters.firstName ?? ""}
            onChange={(event) =>
              handleChange("firstName", event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
        </div>

        {/* Usuario */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Usuario
          </label>

          <input
            type="text"
            placeholder="Buscar por usuario"
            value={filters.username ?? ""}
            onChange={(event) =>
              handleChange("username", event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            placeholder="Buscar por email"
            value={filters.email ?? ""}
            onChange={(event) =>
              handleChange("email", event.target.value)
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
        </div>

        {/* Rol */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Rol
          </label>

          <select
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
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          >
            <option value="ALL">Todos</option>
            <option value="SUPER_ADMINISTRATOR">
              Super Administrador
            </option>
            <option value="ADMINISTRATOR">
              Administrador
            </option>
            <option value="COURT_MANAGER">
              Encargado de Cancha
            </option>
            <option value="CLEANING_STAFF">
              Personal de Limpieza
            </option>
            <option value="RECEPTIONIST">
              Recepcionista
            </option>
          </select>
        </div>

        {/* Estado */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Estado
          </label>

          <select
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
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          >
            <option value="ALL">Todos</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Limpiar
        </button>

        <button
          type="button"
          onClick={onSearch}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Buscar
        </button>
      </div>
    </div>
  );
}