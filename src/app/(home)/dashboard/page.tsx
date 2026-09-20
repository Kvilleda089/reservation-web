
"use client";

import { ProtectedRoute } from "@/src/components/auth/protected.route";
import { ReservationTable } from "@/src/features/dashboard/components/reservation-table";


export default function DashboardPage() {
  return (
    <ProtectedRoute permission="reservations.read">
      <main>
        <ReservationTable></ReservationTable>
      </main>
    </ProtectedRoute>
  );
}

