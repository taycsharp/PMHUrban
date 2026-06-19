import { Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { PageShell } from "@/components/PageShell";

const points = [
  ["Daily convenience", "Crescent Mall, cafes, clinics, supermarkets, parks, and schools are woven into the Phu My Hung routine."],
  ["Verified communities", "Buildings and compounds are easier to compare when ownership, access, furniture, fees, and availability are tracked carefully."],
  ["International fit", "Phu My Hung remains a strong choice for Vietnamese, Korean, Japanese, and global residents who want District 7 stability."]
];

export default function AboutPage() {
  return (
    <PageShell>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Stack spacing={3}>
          <Typography variant="h3">About Phu My Hung living</Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 780 }}>
            Phu My Hung Homes focuses on the neighborhoods, buildings, and owner relationships that shape daily life inside Phu My Hung.
          </Typography>
          <Grid container spacing={2}>
            {points.map(([title, copy]) => (
              <Grid item xs={12} md={4} key={title}>
                <Paper sx={{ p: 2, height: "100%" }}>
                  <Typography variant="h6">{title}</Typography>
                  <Typography color="text.secondary">{copy}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </PageShell>
  );
}

