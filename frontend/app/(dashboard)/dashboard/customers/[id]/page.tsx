import Link from "next/link";
import { Button, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { customers, deals, properties } from "@/lib/sample-data";

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = customers.find((item) => item.id === Number(params.id)) ?? customers[0];
  return (
    <DashboardShell title={`${customer.name} customer detail`}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Typography variant="h6">Customer information</Typography>
              <Typography>{customer.phone}</Typography>
              <Chip label={customer.status} />
              <Typography color="text.secondary">{customer.requirement}</Typography>
              <Button component={Link} href={`/dashboard/matching/${customer.id}`} variant="contained" startIcon={<AutoAwesomeIcon />}>Run Phu My Hung match</Button>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <CrmTable columns={["Matched property", "Project", "Fit"]} rows={properties.slice(0, 4).map((property, index) => [property.code, property.project, `${96 - index * 7}%`])} />
            <CrmTable columns={["Deal", "Stage", "Broker"]} rows={deals.map((deal) => [deal.property, deal.stage, deal.assigned])} />
            <CrmTable columns={["Note", "Activity"]} rows={[["Wants walkable Phu My Hung location", "note added"], ["Viewing planned", "appointment scheduled"]]} />
          </Stack>
        </Grid>
      </Grid>
    </DashboardShell>
  );
}

