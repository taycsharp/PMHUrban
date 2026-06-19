import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { projects } from "@/lib/sample-data";

export default function DashboardProjectsPage() {
  return (
    <DashboardShell title="Phu My Hung projects">
      <CrmTable columns={["Project", "Address", "Amenities", "Active"]} rows={projects.map((project) => [project.name, project.address, project.amenities.join(", "), "Yes"])} />
    </DashboardShell>
  );
}

