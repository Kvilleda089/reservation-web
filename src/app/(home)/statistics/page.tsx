import { ProtectedRoute } from "@/src/components/auth/protected.route";
import Statistics from "@/src/features/statistics/components/statistics";


export default function StatisticsPage() {
  return (
<ProtectedRoute permission="statistics.read">
  <main>
    <Statistics/>
  </main>
</ProtectedRoute>
  );
}

