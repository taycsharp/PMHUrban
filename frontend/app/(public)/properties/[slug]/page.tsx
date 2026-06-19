import Link from "next/link";
import { notFound } from "next/navigation";
import { Box, Button, Chip, Container, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { PageShell } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { properties, propertyPrice } from "@/lib/sample-data";

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export default function PropertyDetailPage({ params }: { params: { slug: string } }) {
  const property = properties.find((item) => item.slug === params.slug);
  if (!property) notFound();
  const similar = properties.filter((item) => item.project === property.project && item.id !== property.id).slice(0, 3);

  return (
    <PageShell>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ aspectRatio: "16 / 9", borderRadius: 2, backgroundImage: `url(${property.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", mb: 2 }} />
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={property.code} />
                <Chip color="primary" label={property.isVerified ? "Verified Phu My Hung listing" : "Verification pending"} />
                <Chip label={property.viewType} />
              </Stack>
              <Typography variant="h3">{property.title}</Typography>
              <Typography variant="h5" color="primary.main">{propertyPrice(property)}</Typography>
              <Typography color="text.secondary">{property.project}, Phu My Hung - {property.areaSqm} m2 - {property.bedrooms} bedrooms - {property.bathrooms} bathrooms</Typography>
              <Typography>{property.description}</Typography>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Nearby Phu My Hung lifestyle points</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                  {property.nearby.map((item) => <Chip key={item} label={item} />)}
                </Stack>
              </Paper>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, position: { md: "sticky" }, top: 88 }}>
              <Stack spacing={2}>
                <Typography variant="h5">Contact Phu My Hung Homes</Typography>
                <TextField label="Full name" size="small" />
                <TextField label="Phone or Zalo" size="small" />
                <TextField label="Message" multiline rows={4} defaultValue={`I want to view ${property.code} in Phu My Hung.`} />
                <Button variant="contained">Request viewing</Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        <Stack spacing={2} sx={{ mt: 5 }}>
          <Typography variant="h4">Similar Phu My Hung properties</Typography>
          <Grid container spacing={2}>{similar.map((item) => <Grid item xs={12} md={4} key={item.id}><PropertyCard property={item} /></Grid>)}</Grid>
          <Button component={Link} href="/rent">Back to Phu My Hung listings</Button>
        </Stack>
      </Container>
    </PageShell>
  );
}

