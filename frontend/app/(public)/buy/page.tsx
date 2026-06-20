import { Container, Grid, Stack, Typography } from "@mui/material";
import { EmptyState } from "@/components/EmptyState";
import { ListingFilters } from "@/components/ListingFilters";
import { PageShell } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { getProperties } from "@/lib/backend-data";

export default async function BuyPage() {
  const sales = await getProperties("sale");
  return (
    <PageShell>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h3">Buy properties in Phu My Hung</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}><ListingFilters listingType="sale" /></Grid>
            <Grid item xs={12} md={9}>
              {sales.length ? (
                <Grid container spacing={2}>{sales.map((property) => <Grid item xs={12} sm={6} lg={4} key={property.id}><PropertyCard property={property} /></Grid>)}</Grid>
              ) : (
                <EmptyState title="No verified Phu My Hung sale listings found" message="Adjust the filters or publish a verified Phu My Hung sale property." />
              )}
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </PageShell>
  );
}
