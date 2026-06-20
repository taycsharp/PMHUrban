import { DashboardShell } from "@/components/DashboardShell";
import { DealsPipeline } from "@/components/LiveDashboardViews";

export default function DealsPage() {
  return (
    <DashboardShell title="Phu My Hung deal pipeline">
      <DealsPipeline />
    </DashboardShell>
  );
}
