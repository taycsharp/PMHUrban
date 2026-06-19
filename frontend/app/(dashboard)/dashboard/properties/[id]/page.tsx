import { notFound } from "next/navigation";
import { Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { properties, propertyPrice } from "@/lib/sample-data";

export default function PropertyAdminDetailPage({ params }: { params: { id: string } }) {
  const property = properties.find((item) => item.id === Number(params.id));
  if (!property) notFound();
  return (
    <DashboardShell title={`${property.code} property detail`}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography variant="h5">{property.title}</Typography>
              <Typography color="primary.main">{propertyPrice(property)}</Typography>
              <Typography>{property.description}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={property.project} /><Chip label={`${property.areaSqm} m2`} /><Chip label={property.furnitureStatus} /><Chip label={property.viewType} />
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Internal Phu My Hung checks</Typography>
            <Typography color="text.secondary">Owner verified, viewing windows available, documents pending upload, broker assigned.</Typography>
          </Paper>
        </Grid>
      </Grid>
    </DashboardShell>
  );
}

