"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import {
    CalendarCheck,
    CalendarDays,
    Users,
    UserCog,
    Menu,
    X,
    BarChart3,
} from "lucide-react";

import { Employee } from "./types/employee.interface";
import { ROLES_LABELS } from "@/src/constants/roles";
import { can } from "@/src/lib/auth/helper/permissions.helper";
import type { Permission } from "@/src/constants/permissions";

interface MenuItem {
    label: string;
    href: string;
    icon: React.ElementType;
    permission: Permission;
}

const MENU_ITEMS: MenuItem[] = [
    {
        label: "Reservaciones",
        href: "/dashboard",
        icon: CalendarCheck,
        permission: "reservations.read",
    },
    {
        label: "Agenda",
        href: "/agenda",
        icon: CalendarDays,
        permission: "agenda.read",
    },
    {
        label: "Empleados",
        href: "/employee",
        icon: UserCog,
        permission: "employees.read",
    },
    {
        label: "Clientes",
        href: "/client",
        icon: Users,
        permission: "clients.read",
    },
    {
        label: "Estadísticas",
        href: "/statistics",
        icon: BarChart3,
        permission: "statistics.read",
    },
];

export default function HomeSidebar() {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [isOpen, setIsOpen] = useState(false);

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

    const closeSidebar = () => {
        setIsOpen(false);
    };

    const visibleMenuItems = employee
        ? MENU_ITEMS.filter((item) =>
              can(employee.role, item.permission)
          )
        : [];

    return (
        <>
            {/* Mobile header */}
            <div className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center border-b bg-white px-4 md:hidden">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="rounded-md p-2 hover:bg-gray-100"
                    aria-label="Abrir menú"
                >
                    <Menu size={24} />
                </button>

                <div className="ml-3">
                    <h1 className="text-lg font-bold">
                        ReservaFácil
                    </h1>

                    <p className="text-xs text-gray-500">
                        Panel de Administración
                    </p>
                </div>
            </div>

            {/* Mobile overlay */}
            {isOpen && (
                <button
                    type="button"
                    aria-label="Cerrar menú"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed left-0 top-0 z-50 flex min-h-screen w-64
                    flex-col border-r bg-white
                    transition-transform duration-200
                    md:static md:z-auto md:translate-x-0
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-4">
                    <div>
                        <h1 className="text-xl font-bold">
                            ReservaFácil
                        </h1>

                        <p className="text-sm text-gray-500">
                            Panel de Administración
                        </p>
                    </div>

                    {/* Close button - mobile only */}
                    <button
                        type="button"
                        onClick={closeSidebar}
                        className="rounded-md p-1 hover:bg-gray-100 md:hidden"
                        aria-label="Cerrar menú"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {visibleMenuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={closeSidebar}
                                        className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-100"
                                    >
                                        <Icon size={20} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Employee */}
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
        </>
    );
}