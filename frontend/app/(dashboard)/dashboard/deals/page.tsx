import Link from "next/link";
import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { deals, formatVnd } from "@/lib/sample-data";

const stages = ["new", "qualified", "viewing", "offer", "negotiation", "deposit", "contract", "closed_won"];

export default function DealsPage() {
  return (
    <DashboardShell title="Phu My Hung deal pipeline">
      <Grid container spacing={1.5}>
        {stages.map((stage) => (
          <Grid item xs={12} md={3} lg={1.5} key={stage}>
            <Stack spacing={1}>
              <Chip label={stage.replace("_", " ")} />
              {deals.filter((deal, index) => deal.stage === stage || index % stages.length === stages.indexOf(stage)).slice(0, 2).map((deal) => (
                <Paper key={deal.id} component={Link} href={`/dashboard/deals/${deal.id}`} sx={{ p: 1.5, display: "block" }}>
                  <Typography variant="body2" fontWeight={700}>{deal.customer}</Typography>
                  <Typography variant="caption" color="text.secondary">{deal.property}</Typography>
                  <Typography variant="body2" color="primary.main">{formatVnd(deal.expectedValue)}</Typography>
                </Paper>
              ))}
              <Box />
            </Stack>
          </Grid>
        ))}
      </Grid>
    </DashboardShell>
  );
}

