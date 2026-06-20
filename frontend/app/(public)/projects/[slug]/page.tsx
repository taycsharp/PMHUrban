import { notFound } from "next/navigation";
import { Box, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { EmptyState } from "@/components/EmptyState";
import { PageShell } from "@/components/PageShell";
import { PropertyCard } from "@/components/PropertyCard";
import { getProject, getProjects, getProperties } from "@/lib/backend-data";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();
  const listings = (await getProperties()).filter((property) => property.projectSlug === project.slug).slice(0, 4);

  return (
    <PageShell>
      <Box sx={{ bgcolor: "primary.dark", color: "white" }}>
        <Container maxWidth="xl" sx={{ py: 5 }}>
          <Typography variant="h3">{project.name} Phu My Hung guide</Typography>
          <Typography sx={{ color: "rgba(255,255,255,.8)", mt: 1 }}>{project.address}</Typography>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ aspectRatio: "16 / 8", borderRadius: 2, backgroundImage: `url(${project.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center", mb: 2 }} />
            <Typography>{project.description}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Typography variant="h6">Amenities and nearby points</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>{project.amenities.map((item) => <Chip key={item} label={item} />)}</Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>{project.nearbyPlaces.map((item) => <Chip key={item} label={item} />)}</Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
        <Stack spacing={2} sx={{ mt: 4 }}>
          <Typography variant="h4">Available homes in {project.name}</Typography>
          {listings.length ? (
            <Grid container spacing={2}>{listings.map((property) => <Grid item xs={12} md={3} key={property.id}><PropertyCard property={property} /></Grid>)}</Grid>
          ) : (
            <EmptyState title={`No current ${project.name} listings`} message="Add or verify more Phu My Hung inventory in the CRM to publish it here." />
          )}
        </Stack>
      </Container>
    </PageShell>
  );
}
