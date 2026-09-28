
"use client";

import { ProtectedRoute } from "@/src/components/auth/protected.route";
import { ClientTable } from "@/src/features/clients/components/client-table";


export default function ClientPage() {
  return (
    <ProtectedRoute permission="clients.read">
      <main>
          <ClientTable/>
      </main>
    </ProtectedRoute>
  );
}

