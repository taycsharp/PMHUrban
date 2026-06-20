import { DashboardShell } from "@/components/DashboardShell";
import { PropertyManagementList } from "@/components/PropertyManagementList";

export default function DashboardPropertiesPage() {
  return (
    <DashboardShell title="Phu My Hung properties">
      <PropertyManagementList />
    </DashboardShell>
  );
}
