"use client";

import { useEffect, useState } from "react";

import { getAllEmployee, getEmployeeOne } from "../services/employee.service";

import { PageLoading } from "@/src/components/loading/page-loading";
import {
  Employee,
  EmployeeListResponse,
  GetOneEmployeeFilters,
} from "../types/employee.types";
import { ROLES_LABELS } from "@/src/constants/roles";
import { StatusBadge } from "./ui/status-badge";
import { EmployeeFilters } from "./employee-fiters";
import { Plus } from "lucide-react";
import { Pagination } from "@/src/components/pagination/pagination";
import { ActionsMenu } from "@/src/components/ui/action-menu";
import { EmployeeDialog } from "./dialog/employee-dialog";
import { EmployeeCreateDialog } from "./dialog/create-employee-dialog";

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);

  const [dialogTab, setDialogTab] = useState<"information" | "edit">(
    "information",
  );

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPage, setTotalPage] = useState(1);

  //filtros user
  const [filters, setFilters] = useState<GetOneEmployeeFilters>({
    firstName: "",
    middleName: "",
    surname: "",
    secondSurname: "",
    email: "",
    username: "",
    phoneNumber: "",
    role: undefined,
    status: undefined,
  });

  const [openDialogCreateEmploye, setOpenDialogCreateEmploy] = useState(false);

  //Busqeuda empleado
  const handleSearch = async () => {
    try {
      setLoading(true);

      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== undefined,
        ),
      ) as GetOneEmployeeFilters;

      if (Object.keys(cleanFilters).length === 0) {
        setPage(1);

        const response = await getAllEmployee(1, limit);

        setEmployees(response.data);
        setTotalPage(response.pagination.lastPage);

        return;
      }

      const response = await getEmployeeOne(cleanFilters);

      setEmployees([response.data]);
      setTotalPage(1);
      setPage(1);
    } catch (error) {
      console.error("Error al buscar empleados:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    const emptyFilters: GetOneEmployeeFilters = {
      firstName: "",
      middleName: "",
      surname: "",
      secondSurname: "",
      email: "",
      username: "",
      phoneNumber: "",
      role: undefined,
      status: undefined,
    };

    setFilters(emptyFilters);
    setPage(1);

    try {
      setLoading(true);

      const response = await getAllEmployee(1, limit);

      setEmployees(response.data);
      setTotalPage(response.pagination.lastPage);
    } catch (error) {
      console.error("Error al obtener empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);

        const response: EmployeeListResponse = await getAllEmployee(
          page,
          limit,
        );

        setEmployees(response.data);
        setTotalPage(response.pagination.lastPage);
      } catch (error) {
        console.error("Error al obtener empleados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [page, limit]);

  if (loading) {
    return <PageLoading />;
  }

  const reloadEmployees = async () => {
    try {
      setLoading(true);

      const response = await getAllEmployee(page, limit);

      setEmployees(response.data);
      setTotalPage(response.pagination.lastPage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-visible rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        {/** Filtros  */}
        <EmployeeFilters
          filters={filters}
          onChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <div className="flex justify-end my-4 ">
          <button
            type="button"
            onClick={() => setOpenDialogCreateEmploy(true)}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Crear Nuevo Empleado
          </button>
        </div>

        {/**Tabla */}
        <table className="w-full table-auto text-left text-sm text-gray-600">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-4 font-semibold lg:px-4">Empleado</th>

              <th className="px-3 py-4 font-semibold lg:px-4">Usuario</th>

              <th className="px-3 py-4 font-semibold lg:px-4">Email</th>

              <th className="px-3 py-4 font-semibold lg:px-4">Teléfono</th>

              <th className="px-3 py-4 font-semibold lg:px-4">Rol</th>

              <th className="px-3 py-4 font-semibold lg:px-4">Estado</th>

              <th className="w-12 px-2 py-4 text-center font-semibold">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="transition-colors hover:bg-gray-50"
              >
                {/* Empleado */}
                <td className="max-w-0 px-3 py-4 font-medium text-gray-900 lg:px-4">
                  <div
                    className="break-words"
                    title={`${employee.firstName} ${employee.surname} ${employee.secondSurname}`}
                  >
                    {employee.firstName} {employee.surname}{" "}
                    {employee.secondSurname}
                  </div>
                </td>

                {/* Usuario */}
                <td className="whitespace-nowrap px-3 py-4 font-medium text-gray-900 lg:px-4">
                  {employee.username}
                </td>

                {/* Email */}
                <td className="px-3 py-4 lg:px-4">
                  <div className="max-w-xs truncate" title={employee.email}>
                    {employee.email}
                  </div>
                </td>

                {/* Teléfono */}
                <td className="whitespace-nowrap px-3 py-4 lg:px-4">
                  {employee.phoneNumber ?? "—"}
                </td>

                {/* Rol */}
                <td className="px-3 py-4 font-medium text-gray-900 lg:px-4">
                  {ROLES_LABELS[employee.role] ?? employee.role}
                </td>

                {/* Estado */}
                <td className="px-6 py-4">
                  <StatusBadge
                    variant={employee.status ? "active" : "inactive"}
                  >
                    {employee.status ? "ACTIVO" : "INACTIVO"}
                  </StatusBadge>
                </td>

                {/* Acciones */}
                <td className="px-2 py-4 text-center">
                  <ActionsMenu
                    items={[
                      {
                        label: "Información empleado",
                        onClick: () => {
                          setSelectedEmployee(employee);
                          setDialogTab("information");
                          setEmployeeDialogOpen(true);
                        },
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}

            {employees.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No se encontraron empleados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination page={page} totalPage={totalPage} onPageChange={setPage} />

      {/** Dialogs */}
      {selectedEmployee && (
        <EmployeeDialog
          open={employeeDialogOpen}
          employee={selectedEmployee}
          initialTab={dialogTab}
          onOpenChange={setEmployeeDialogOpen}
          onUpdated={reloadEmployees}
        />
      )}

      <EmployeeCreateDialog
          open={openDialogCreateEmploye}
          onOpenChange={setOpenDialogCreateEmploy}
          onSuccess={reloadEmployees}
        />
    </div>
  );
}
