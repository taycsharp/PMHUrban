import { Chip } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { properties } from "@/lib/sample-data";

export default function ViewingsPage() {
  return (
    <DashboardShell title="Phu My Hung viewings">
      <CrmTable
        columns={["When", "Customer", "Property", "Meeting location", "Status", "Next follow-up"]}
        rows={properties.slice(0, 10).map((property, index) => [
          `2026-07-${String(index + 1).padStart(2, "0")} 10:00`,
          `Customer ${index + 1}`,
          property.code,
          "Phu My Hung Sales Gallery",
          <Chip key="status" size="small" label={index % 3 ? "scheduled" : "completed"} />,
          `2026-07-${String(index + 2).padStart(2, "0")}`
        ])}
      />
    </DashboardShell>
  );
}

