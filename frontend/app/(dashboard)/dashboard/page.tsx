import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { StatCard } from "@/components/StatCard";
import { deals, properties } from "@/lib/sample-data";

export default function DashboardPage() {
  return (
    <DashboardShell title="Phu My Hung dashboard">
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}><StatCard label="Total properties" value={40} detail="Phu My Hung inventory" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Available properties" value={34} detail="Ready or upcoming" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Active customers" value={30} detail="Tenant, buyer, investor" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Viewings this week" value={9} detail="Scheduled appointments" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Open deals" value={8} detail="Pipeline value tracking" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Deals won this month" value={2} detail="Closed Phu My Hung deals" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Estimated commission" value="105M" detail="Expected VND" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Verified listings" value={28} detail="Owner-confirmed homes" /></Grid>
        <Grid item xs={12} md={7}>
          <Stack spacing={2}>
            <Typography variant="h6">Deal pipeline summary</Typography>
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {["new", "qualified", "viewing", "offer", "negotiation", "deposit", "contract", "closed_won"].map((stage, index) => (
                  <Chip key={stage} color={index > 5 ? "secondary" : "default"} label={`${stage.replace("_", " ")}: ${index + 1}`} />
                ))}
              </Stack>
            </Paper>
            <CrmTable columns={["Recent activity", "Entity", "Owner"]} rows={properties.slice(0, 5).map((property) => ["Property status changed", property.code, property.project])} />
          </Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack spacing={2}>
            <Typography variant="h6">Upcoming appointments</Typography>
            <CrmTable columns={["Customer", "Property", "Stage"]} rows={deals.map((deal) => [deal.customer, deal.property, deal.stage])} />
            <Box />
          </Stack>
        </Grid>
      </Grid>
    </DashboardShell>
  );
}

