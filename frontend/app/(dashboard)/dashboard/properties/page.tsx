import Link from "next/link";
import { Button, Chip, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { properties, propertyPrice } from "@/lib/sample-data";

export default function DashboardPropertiesPage() {
  return (
    <DashboardShell title="Phu My Hung properties">
      <Stack spacing={2}>
        <Button component={Link} href="/dashboard/properties/new" variant="contained" startIcon={<AddIcon />} sx={{ alignSelf: "flex-start" }}>New property</Button>
        <CrmTable
          columns={["Code", "Title", "Project", "Price", "Status", "Flags"]}
          rows={properties.map((property) => [
            <Link key={property.id} href={`/dashboard/properties/${property.id}`}>{property.code}</Link>,
            property.title,
            property.project,
            propertyPrice(property),
            property.status,
            <Stack key="flags" direction="row" spacing={0.5}>{property.isVerified && <Chip size="small" label="Verified" />}{property.isFeatured && <Chip size="small" label="Featured" />}</Stack>
          ])}
        />
      </Stack>
    </DashboardShell>
  );
}

