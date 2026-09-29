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
import { Button } from "@/src/components/ui/button";
import {
  Table,
  TableBody,
  TableContainer,
  TableEmptyRow,
  TableHead,
  TableRow,
  TableScroll,
  Td,
  Th,
} from "@/src/components/ui/table";

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
    <TableContainer>
      <TableScroll>
        {/** Filtros  */}
        <EmployeeFilters
          filters={filters}
          onChange={setFilters}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <div className="flex justify-end my-4 ">
          <Button onClick={() => setOpenDialogCreateEmploy(true)}>
            <Plus size={18} />
            Crear Nuevo Empleado
          </Button>
        </div>

        {/**Tabla */}
        <Table>
          <TableHead>
            <tr>
              <Th>Empleado</Th>
              <Th className="hidden sm:table-cell">Usuario</Th>
              <Th className="hidden lg:table-cell">Email</Th>
              <Th className="hidden md:table-cell">Teléfono</Th>
              <Th>Rol</Th>
              <Th>Estado</Th>
              <Th className="w-12 px-2 text-center">
                <span className="sr-only">Acciones</span>
              </Th>
            </tr>
          </TableHead>

          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                {/* Empleado */}
                <Td className="max-w-0">
                  <div
                    className="break-words"
                    title={`${employee.firstName} ${employee.surname} ${employee.secondSurname}`}
                  >
                    {employee.firstName} {employee.surname}{" "}
                    {employee.secondSurname}
                  </div>
                </Td>

                {/* Usuario */}
                <Td className="hidden whitespace-nowrap sm:table-cell">
                  {employee.username}
                </Td>

                {/* Email */}
                <Td className="hidden lg:table-cell">
                  <div className="max-w-xs truncate" title={employee.email}>
                    {employee.email}
                  </div>
                </Td>

                {/* Teléfono */}
                <Td className="hidden whitespace-nowrap md:table-cell">
                  {employee.phoneNumber ?? "—"}
                </Td>

                {/* Rol */}
                <Td>{ROLES_LABELS[employee.role] ?? employee.role}</Td>

                {/* Estado */}
                <Td className="px-6">
                  <StatusBadge
                    variant={employee.status ? "active" : "inactive"}
                  >
                    {employee.status ? "ACTIVO" : "INACTIVO"}
                  </StatusBadge>
                </Td>

                {/* Acciones */}
                <Td className="px-2 text-center">
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
                </Td>
              </TableRow>
            ))}

            {employees.length === 0 && (
              <TableEmptyRow colSpan={7}>
                No se encontraron empleados.
              </TableEmptyRow>
            )}
          </TableBody>
        </Table>
      </TableScroll>

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
    </TableContainer>
  );
}