import { useState } from "react";
import { Employee } from "../../types/employee.types";
import { EmployeeInformation } from "./employee-information";
import { EmployeeEditDialog } from "./employee-edit-dialog";
import { Modal, ModalFooter } from "@/src/components/ui/modal";
import { Button } from "@/src/components/ui/button";

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

  if (!employee) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      title="Empleado"
      description={`${employee.firstName} ${employee.surname}`}
      size="md"
    >
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
          <EmployeeInformation employee={employee} />
        )}

        {activeTab === "edit" && (
          <EmployeeEditDialog
            employee={employee}
            onSuccess={() => {
              onOpenChange(false);
              onUpdated();
            }}
          />
        )}
      </div>

      {/* Footer */}
      <ModalFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
}