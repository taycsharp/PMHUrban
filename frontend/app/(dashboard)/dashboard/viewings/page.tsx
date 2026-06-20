import { DashboardShell } from "@/components/DashboardShell";
import { ViewingsTable } from "@/components/LiveDashboardViews";

export default function ViewingsPage() {
  return (
    <DashboardShell title="Phu My Hung viewings">
      <ViewingsTable />
    </DashboardShell>
  );
}
