"use client";

import React, { useEffect, useState } from "react";
import {
    CalendarCheck,
    CalendarDays,
    Users,
} from "lucide-react";

import { Employee } from "./types/employee.interface";
import { ROLES_LABELS } from "@/src/constants/roles";

export default function HomeSidebar() {
    const [employee, setEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        const storedEmployee = localStorage.getItem(
            "reservation_employee"
        );

        if (!storedEmployee) {
            return;
        }

        try {
            setEmployee(JSON.parse(storedEmployee));
        } catch (error) {
            console.error(
                "Error leyendo reservation_employee:",
                error
            );
        }
    }, []);

    return (
        <aside className="flex min-h-screen w-64 flex-col border-r">
            <div className="p-4">
                <h1 className="text-xl font-bold">
                    ReservaFácil
                </h1>

                <p className="text-sm">
                    Panel de Administración
                </p>
            </div>

            <nav className="p-4">
                <ul className="space-y-2">
                    <li>
                        <a
                            href="/dashboard"
                            className="flex items-center gap-3"
                        >
                            <CalendarCheck size={20} />
                            Reservaciones
                        </a>
                    </li>

                    <li>
                        <a
                            href="/agenda"
                            className="flex items-center gap-3"
                        >
                            <CalendarDays size={20} />
                            Agenda
                        </a>
                    </li>

                    <li>
                        <a
                            href="/employee"
                            className="flex items-center gap-3"
                        >
                            <Users size={20} />
                            Empleados
                        </a>
                    </li>
                </ul>
            </nav>

            {employee && (
                <div className="mt-auto border-t p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold">
                            {employee.firstName.charAt(0)}
                            {employee.surname.charAt(0)}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                                {employee.firstName}{" "}
                                {employee.surname}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                                {ROLES_LABELS[employee.role] ??
                                    employee.role}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}