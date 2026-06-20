"use client";

import { Alert, Box, Chip, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { EmptyState } from "@/components/EmptyState";
import { CrmTable } from "@/components/CrmTable";
import { StatCard } from "@/components/StatCard";
import { useApiQuery } from "@/hooks/useApiQuery";
import { formatVnd } from "@/lib/sample-data";

type DashboardSummary = {
  total_properties: number;
  available_properties: number;
  active_customers: number;
  viewings_this_week: number;
  open_deals: number;
  deals_won_this_month: number;
  estimated_commission: number;
  deal_pipeline: Record<string, number>;
  recent_activities: Array<{ action: string; entity_type: string; note: string }>;
  upcoming_appointments: Array<{ id: number; customer_id: number; property_id: number; status: string; scheduled_at: string }>;
};

export function DashboardOverview() {
  const { data, isLoading, isError } = useApiQuery<DashboardSummary>(["dashboard-summary"], "/dashboard");

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <LinearProgress />
        <Typography color="text.secondary">Loading Phu My Hung CRM dashboard...</Typography>
      </Stack>
    );
  }

  if (isError || !data) {
    return <Alert severity="error">Could not load the Phu My Hung CRM dashboard. Check API connectivity and login status.</Alert>;
  }

  const pipeline = Object.entries(data.deal_pipeline);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}><StatCard label="Total properties" value={data.total_properties} detail="Phu My Hung inventory" /></Grid>
      <Grid item xs={12} md={3}><StatCard label="Available properties" value={data.available_properties} detail="Ready or upcoming" /></Grid>
      <Grid item xs={12} md={3}><StatCard label="Active customers" value={data.active_customers} detail="Tenant, buyer, investor" /></Grid>
      <Grid item xs={12} md={3}><StatCard label="Viewings this week" value={data.viewings_this_week} detail="Scheduled appointments" /></Grid>
      <Grid item xs={12} md={3}><StatCard label="Open deals" value={data.open_deals} detail="Pipeline value tracking" /></Grid>
      <Grid item xs={12} md={3}><StatCard label="Deals won this month" value={data.deals_won_this_month} detail="Closed Phu My Hung deals" /></Grid>
      <Grid item xs={12} md={3}><StatCard label="Estimated commission" value={formatVnd(data.estimated_commission)} detail="Expected VND" /></Grid>
      <Grid item xs={12} md={3}><StatCard label="Available rate" value={`${Math.round((data.available_properties / Math.max(data.total_properties, 1)) * 100)}%`} detail="Inventory readiness" /></Grid>
      <Grid item xs={12} md={7}>
        <Stack spacing={2}>
          <Typography variant="h6">Deal pipeline summary</Typography>
          {pipeline.length ? (
            <Paper sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {pipeline.map(([stage, count]) => (
                  <Chip key={stage} color={stage.includes("closed") ? "secondary" : "default"} label={`${stage.replace("_", " ")}: ${count}`} />
                ))}
              </Stack>
            </Paper>
          ) : (
            <EmptyState title="No open pipeline yet" message="Create Phu My Hung deals to populate the pipeline summary." />
          )}
          <CrmTable
            columns={["Recent activity", "Entity", "Note"]}
            rows={data.recent_activities.map((activity) => [activity.action, activity.entity_type, activity.note])}
          />
        </Stack>
      </Grid>
      <Grid item xs={12} md={5}>
        <Stack spacing={2}>
          <Typography variant="h6">Upcoming appointments</Typography>
          {data.upcoming_appointments.length ? (
            <CrmTable
              columns={["When", "Customer", "Property", "Status"]}
              rows={data.upcoming_appointments.map((appointment) => [
                new Date(appointment.scheduled_at).toLocaleString(),
                `#${appointment.customer_id}`,
                `#${appointment.property_id}`,
                appointment.status
              ])}
            />
          ) : (
            <EmptyState title="No upcoming Phu My Hung viewings" message="Schedule appointments from a customer or property record." />
          )}
          <Box />
        </Stack>
      </Grid>
    </Grid>
  );
}

