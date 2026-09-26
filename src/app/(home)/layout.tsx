'use client'

import React from "react";

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