import { DashboardShell } from "@/components/DashboardShell";
import { OwnerDetailPanel } from "@/components/LiveDashboardViews";

export default function OwnerDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell title={`Phu My Hung owner ${params.id}`}>
      <OwnerDetailPanel ownerId={params.id} />
    </DashboardShell>
  );
}
