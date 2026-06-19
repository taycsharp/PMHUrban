import { Chip } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { deals, formatVnd } from "@/lib/sample-data";

export default function CommissionsPage() {
  return (
    <DashboardShell title="Phu My Hung commissions">
      <CrmTable
        columns={["Deal", "Broker", "Gross", "Company share", "Broker share", "Status"]}
        rows={deals.map((deal, index) => [
          deal.property,
          deal.assigned,
          formatVnd(deal.commission),
          formatVnd(deal.commission / 2),
          formatVnd(deal.commission / 2),
          <Chip key="status" size="small" label={index === 0 ? "partial" : "pending"} />
        ])}
      />
    </DashboardShell>
  );
}

