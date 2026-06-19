import { Chip } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";

const users = [
  ["admin@pmhhomes.local", "Admin", "Full system access"],
  ["manager@pmhhomes.local", "Manager", "Team data and assignments"],
  ["broker1@pmhhomes.local", "Broker", "Assigned Phu My Hung data"],
  ["broker2@pmhhomes.local", "Broker", "Assigned Phu My Hung data"],
  ["viewer@pmhhomes.local", "Viewer", "Read-only access"]
];

export default function UsersPage() {
  return (
    <DashboardShell title="Phu My Hung CRM users">
      <CrmTable columns={["Email", "Role", "Permission"]} rows={users.map(([email, role, permission]) => [email, <Chip key={role} label={role} size="small" />, permission])} />
    </DashboardShell>
  );
}

