import { Container, Grid, Stack, Typography } from "@mui/material";
import { EmptyState } from "@/components/EmptyState";
import { ListingFilters } from "@/components/ListingFilters";
import { PageShell } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { getProperties } from "@/lib/backend-data";

export default async function RentPage() {
  const rentals = await getProperties("rent");
  return (
    <PageShell>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h3">Rent properties in Phu My Hung</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}><ListingFilters listingType="rent" /></Grid>
            <Grid item xs={12} md={9}>
              {rentals.length ? (
                <Grid container spacing={2}>{rentals.map((property) => <Grid item xs={12} sm={6} lg={4} key={property.id}><PropertyCard property={property} /></Grid>)}</Grid>
              ) : (
                <EmptyState title="No verified Phu My Hung rentals found" message="Adjust the filters or add a new verified rental in the CRM." />
              )}
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </PageShell>
  );
}
