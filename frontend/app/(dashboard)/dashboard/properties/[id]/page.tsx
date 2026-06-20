import { DashboardShell } from "@/components/DashboardShell";
import { PropertyDetailPanel } from "@/components/PropertyDetailPanel";

export default function PropertyAdminDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell title="Phu My Hung property detail">
      <PropertyDetailPanel propertyId={params.id} />
    </DashboardShell>
  );
}
