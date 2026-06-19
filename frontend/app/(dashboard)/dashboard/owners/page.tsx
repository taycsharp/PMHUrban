import Link from "next/link";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";

const owners = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  name: `Phu My Hung Owner ${String(index + 1).padStart(2, "0")}`,
  phone: `+84 90 900 ${String(index + 1).padStart(4, "0")}`,
  language: index % 2 ? "English" : "Vietnamese",
  properties: index + 2,
  broker: `Broker ${(index % 3) + 1}`
}));

export default function OwnersPage() {
  return (
    <DashboardShell title="Phu My Hung owners">
      <CrmTable
        columns={["Owner", "Phone", "Language", "Owned properties", "Assigned broker"]}
        rows={owners.map((owner) => [<Link key={owner.id} href={`/dashboard/owners/${owner.id}`}>{owner.name}</Link>, owner.phone, owner.language, owner.properties, owner.broker])}
      />
    </DashboardShell>
  );
}

