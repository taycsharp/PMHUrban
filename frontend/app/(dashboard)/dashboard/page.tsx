import { DashboardShell } from "@/components/DashboardShell";
import { DashboardOverview } from "@/components/DashboardOverview";

export default function DashboardPage() {
  return (
    <DashboardShell title="Phu My Hung dashboard">
      <DashboardOverview />
    </DashboardShell>
  );
}
