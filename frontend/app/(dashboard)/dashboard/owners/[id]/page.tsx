import { Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { properties } from "@/lib/sample-data";

export default function OwnerDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell title={`Phu My Hung owner ${params.id}`}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography variant="h6">Owner information</Typography>
              <Typography>Phone: +84 90 900 000{params.id}</Typography>
              <Typography>Email: owner{params.id}@pmhhomes.local</Typography>
              <Typography>Preferred language: English</Typography>
              <Chip label="Assigned to Broker 1" />
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <CrmTable columns={["Owned properties", "Project", "Status"]} rows={properties.slice(0, 4).map((property) => [property.code, property.project, property.status])} />
            <CrmTable columns={["Activity", "Note"]} rows={[["Note added", "Owner confirmed Phu My Hung viewing windows"], ["Deal created", "Rental negotiation opened"]]} />
          </Stack>
        </Grid>
      </Grid>
    </DashboardShell>
  );
}

