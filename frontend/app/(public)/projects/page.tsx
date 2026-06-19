import Link from "next/link";
import { Box, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { PageShell } from "@/components/PageShell";
import { projects } from "@/lib/sample-data";

export default function ProjectsPage() {
  return (
    <PageShell>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h3">Phu My Hung project and building guide</Typography>
          <Grid container spacing={2}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.slug}>
                <Paper sx={{ overflow: "hidden", height: "100%" }}>
                  <Box sx={{ aspectRatio: "16 / 9", backgroundImage: `url(${project.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <Stack spacing={1} sx={{ p: 2 }}>
                    <Typography variant="h6">{project.name}</Typography>
                    <Typography color="text.secondary">{project.description}</Typography>
                    <Button component={Link} href={`/projects/${project.slug}`} endIcon={<ArrowForwardIcon />}>Open guide</Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </PageShell>
  );
}

