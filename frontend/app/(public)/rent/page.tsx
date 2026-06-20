import { Container, Grid, Stack, Typography } from "@mui/material";
import { EmptyState } from "@/components/EmptyState";
import { ListingFilters } from "@/components/ListingFilters";
import { PageShell } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { filtersFromSearchParams, getProjects, getProperties } from "@/lib/backend-data";

export default async function RentPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const filters = filtersFromSearchParams("rent", searchParams);
  const [projects, rentals] = await Promise.all([getProjects(), getProperties(filters)]);
  return (
    <PageShell>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="h3">Rent properties in Phu My Hung</Typography>
            <Typography color="text.secondary">{rentals.length} verified rental{rentals.length === 1 ? "" : "s"} match your filters.</Typography>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}><ListingFilters listingType="rent" projects={projects} values={filters} /></Grid>
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
