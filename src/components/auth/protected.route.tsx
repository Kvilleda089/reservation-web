"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/src/features/auth/context/auth.context";
import type { Permission } from "@/src/constants/permissions";
import { can } from "@/src/lib/auth/helper/permissions.helper";

interface ProtectedRouteProps {
  permission: Permission;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  permission,
  children,
}: ProtectedRouteProps) => {
  const router = useRouter();

  const { employee, isInitialized } = useAuth();

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!employee) {
      router.replace("/login");
      return;
    }

    const hasPermission = can(employee.role, permission);

    if (!hasPermission) {
      router.replace("/agenda");
    }
  }, [employee, isInitialized, permission, router]);

  if (!isInitialized) {
    return null;
  }

  if (!employee) {
    return null;
  }

  if (!can(employee.role, permission)) {
    return null;
  }

  return children;
};