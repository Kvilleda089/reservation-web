"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/src/features/auth/context/auth.context";
import type { Permission } from "@/src/constants/permissions";
import { can } from "@/src/lib/auth/helper/permissions.helper";
import { AccessDenied } from "./access-denied";

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

    // Las redirecciones son efectos secundarios: nunca deben hacerse durante el render.
    useEffect(() => {
        if (isInitialized && !employee) {
            router.replace("/login");
        }
    }, [isInitialized, employee, router]);

    if (!isInitialized || !employee) {
        return null;
    }

    if (!can(employee.role, permission)) {
        return <AccessDenied />;
    }

    return children;
};