import { DashboardShell } from "@/components/DashboardShell";
import { CustomerDetailPanel } from "@/components/LiveDashboardViews";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell title="Phu My Hung customer detail">
      <CustomerDetailPanel customerId={params.id} />
    </DashboardShell>
  );
}
