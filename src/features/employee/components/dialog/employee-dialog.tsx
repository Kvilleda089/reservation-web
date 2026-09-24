import { useState } from "react";
import { X } from "lucide-react";
import { Employee } from "../../types/employee.types";
import { EmployeeInformation } from "./employee-information";
import { EmployeeEditDialog } from "./employee-edit-dialog";

interface EmployeeDialogProps {
  open: boolean;
  employee: Employee | null;
  initialTab: "information" | "edit";
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EmployeeDialog({
  open,
  employee,
  initialTab,
  onOpenChange,
  onUpdated,
}: EmployeeDialogProps) {
  const [activeTab, setActiveTab] = useState<"information" | "edit">(
    initialTab,
  );

  if (!open || !employee) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Empleado
            </h2>

            <p className="text-sm text-gray-500">
              {employee.firstName} {employee.surname}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("information")}
              className={`border-b-2 py-3 text-sm font-medium ${
                activeTab === "information"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Información empleado
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`border-b-2 py-3 text-sm font-medium ${
                activeTab === "edit"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              Editar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "information" && (
                <EmployeeInformation 
                    employee={employee}
                />
          )}

          {activeTab === "edit" && (
             <EmployeeEditDialog
                employee={employee}
                onSuccess={() => { 
                  onOpenChange(false)
                  onUpdated();
                }}
             />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t px-6 py-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}