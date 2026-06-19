import Link from "next/link";
import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { PageShell } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { SearchPanel } from "@/components/SearchPanel";
import { projects, properties } from "@/lib/sample-data";

export default function HomePage() {
  const rentals = properties.filter((property) => property.listingType === "rent" && property.isFeatured).slice(0, 3);
  const sales = properties.filter((property) => property.listingType === "sale" && property.isFeatured).slice(0, 3);

  return (
    <PageShell>
      <Box sx={{ bgcolor: "primary.dark", color: "white" }}>
        <Container maxWidth="xl" sx={{ py: { xs: 6, md: 9 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 64 }, maxWidth: 760 }}>
                  Find your ideal home in Phu My Hung
                </Typography>
                <Typography variant="h6" sx={{ color: "rgba(255,255,255,.8)", maxWidth: 680 }}>
                  Verified rentals, sales, owners, viewings, and broker follow-up for people who only want Phu My Hung.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <Button component={Link} href="/rent" variant="contained" color="secondary" endIcon={<ArrowForwardIcon />}>Browse rentals</Button>
                  <Button component={Link} href="/buy" variant="outlined" sx={{ color: "white", borderColor: "rgba(255,255,255,.6)" }}>Buy in Phu My Hung</Button>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ minHeight: 360, borderRadius: 2, backgroundImage: "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
            </Grid>
          </Grid>
          <Box sx={{ mt: 4 }}>
            <SearchPanel />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Stack spacing={5}>
          <Stack spacing={2}>
            <Typography variant="h4">Featured Phu My Hung rentals</Typography>
            <Grid container spacing={2}>{rentals.map((property) => <Grid item xs={12} md={4} key={property.id}><PropertyCard property={property} /></Grid>)}</Grid>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h4">Featured Phu My Hung sale properties</Typography>
            <Grid container spacing={2}>{sales.map((property) => <Grid item xs={12} md={4} key={property.id}><PropertyCard property={property} /></Grid>)}</Grid>
          </Stack>
          <Stack spacing={2}>
            <Typography variant="h4">Popular Phu My Hung projects</Typography>
            <Grid container spacing={2}>
              {projects.slice(0, 6).map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project.slug}>
                  <Paper component={Link} href={`/projects/${project.slug}`} sx={{ display: "block", p: 2, height: "100%" }}>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography color="text.secondary">{project.address}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Stack>
          <Paper sx={{ p: 3, bgcolor: "primary.light" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h4">Why choose Phu My Hung Homes</Typography>
                <Typography color="text.secondary">Focused inventory, verified owners, practical viewing coordination, and CRM-backed follow-up for every Phu My Hung requirement.</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button fullWidth component={Link} href="/contact" variant="contained" size="large">Contact Phu My Hung Homes</Button>
              </Grid>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </PageShell>
  );
}

