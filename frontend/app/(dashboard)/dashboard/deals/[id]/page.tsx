import { DashboardShell } from "@/components/DashboardShell";
import { DealDetailPanel } from "@/components/LiveDashboardViews";

export default function DealDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell title={`Phu My Hung deal ${params.id}`}>
      <DealDetailPanel dealId={params.id} />
    </DashboardShell>
  );
}
