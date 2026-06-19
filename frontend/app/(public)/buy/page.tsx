import { Container, Grid, Stack, Typography } from "@mui/material";
import { ListingFilters } from "@/components/ListingFilters";
import { PageShell } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/lib/sample-data";

export default function BuyPage() {
  const sales = properties.filter((property) => property.listingType === "sale");
  return (
    <PageShell>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h3">Buy properties in Phu My Hung</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}><ListingFilters listingType="sale" /></Grid>
            <Grid item xs={12} md={9}>
              <Grid container spacing={2}>{sales.map((property) => <Grid item xs={12} sm={6} lg={4} key={property.id}><PropertyCard property={property} /></Grid>)}</Grid>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </PageShell>
  );
}

