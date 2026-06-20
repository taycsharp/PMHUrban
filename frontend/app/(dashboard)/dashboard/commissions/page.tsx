import { DashboardShell } from "@/components/DashboardShell";
import { CommissionsTable } from "@/components/LiveDashboardViews";

export default function CommissionsPage() {
  return (
    <DashboardShell title="Phu My Hung commissions">
      <CommissionsTable />
    </DashboardShell>
  );
}
