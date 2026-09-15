
"use client";

import { ProtectedRoute } from "@/src/components/auth/protected.route";


export default function DashboardPage() {
  return (
    <ProtectedRoute permission="reservations.read">
      <main>
        <h1>Dashboard</h1>
      </main>
    </ProtectedRoute>
  );
}

