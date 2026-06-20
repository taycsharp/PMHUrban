import { DashboardShell } from "@/components/DashboardShell";
import { ProjectsTable } from "@/components/LiveDashboardViews";

export default function DashboardProjectsPage() {
  return (
    <DashboardShell title="Phu My Hung projects">
      <ProjectsTable />
    </DashboardShell>
  );
}
