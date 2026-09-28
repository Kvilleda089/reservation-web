"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/src/features/auth/context/auth.context";
import { getDefaultRoute } from "@/src/lib/auth/helper/permissions.helper";

export function AccessDenied() {
    const { employee } = useAuth();

    const homeRoute = employee ? getDefaultRoute(employee.role) : null;

    return (
        <main className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <LockKeyhole size={32} className="text-gray-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                    Acceso restringido
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                    No cuentas con los permisos necesarios para
                    acceder a esta sección.
                </p>

                {homeRoute && (
                    <Link
                        href={homeRoute}
                        className="mt-6 inline-flex rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                        Volver al inicio
                    </Link>
                )}
            </div>
        </main>
    );
}