import Link from "next/link";
import { Chip, Stack } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { customers } from "@/lib/sample-data";

export default function CustomersPage() {
  return (
    <DashboardShell title="Phu My Hung customers">
      <CrmTable
        columns={["Customer", "Phone", "Type", "Status", "Requirement", "Assigned"]}
        rows={customers.map((customer) => [
          <Link key={customer.id} href={`/dashboard/customers/${customer.id}`}>{customer.name}</Link>,
          customer.phone,
          customer.type,
          <Chip key="status" size="small" label={customer.status} />,
          customer.requirement,
          customer.assigned
        ])}
      />
      <Stack sx={{ mt: 2 }} />
    </DashboardShell>
  );
}

