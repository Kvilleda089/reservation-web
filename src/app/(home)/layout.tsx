'use client'

import React, { useEffect, useState } from "react";
import { CalendarCheck, CalendarDays, Users } from "lucide-react";
import { Employee } from "./types/employee.interface";
import { ROLES_LABELS } from "@/src/constants/roles";
import HomeSidebar from "./home-sidebar";

export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <HomeSidebar/>


 

            <main className="flex-1 p-6">
                {children}
            </main>
        </div>
    );
}