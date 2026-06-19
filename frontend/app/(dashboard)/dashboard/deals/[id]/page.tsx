import { Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { deals, formatVnd } from "@/lib/sample-data";

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = deals.find((item) => item.id === Number(params.id)) ?? deals[0];
  return (
    <DashboardShell title={`Phu My Hung deal ${deal.id}`}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography variant="h6">{deal.customer}</Typography>
              <Typography>{deal.property}</Typography>
              <Chip label={deal.stage} />
              <Typography color="primary.main">{formatVnd(deal.expectedValue)}</Typography>
              <Typography>Commission: {formatVnd(deal.commission)}</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <CrmTable columns={["Timeline", "Note"]} rows={[["Deal created", "Customer qualified for Phu My Hung viewing"], ["Stage changed", "Offer prepared"], ["Commission updated", "Broker split estimated"]]} />
        </Grid>
      </Grid>
    </DashboardShell>
  );
}

