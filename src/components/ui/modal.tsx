"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  closeDisabled?: boolean;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  closeDisabled = false,
  size = "sm",
  children,
}: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={cn(
          "flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl",
          SIZE_CLASSES[size],
        )}
      >
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function ModalFooter({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end">
      {children}
    </div>
  );
}