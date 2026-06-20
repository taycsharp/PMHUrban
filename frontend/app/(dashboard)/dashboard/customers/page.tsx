import { DashboardShell } from "@/components/DashboardShell";
import { CustomersTable } from "@/components/LiveDashboardViews";

export default function CustomersPage() {
  return (
    <DashboardShell title="Phu My Hung customers">
      <CustomersTable />
    </DashboardShell>
  );
}
