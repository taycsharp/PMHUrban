import { DashboardShell } from "@/components/DashboardShell";
import { OwnersTable } from "@/components/LiveDashboardViews";

export default function OwnersPage() {
  return (
    <DashboardShell title="Phu My Hung owners">
      <OwnersTable />
    </DashboardShell>
  );
}
