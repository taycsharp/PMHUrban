import { Button, Container, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { PageShell } from "@/components/PageShell";

export default function ContactPage() {
  return (
    <PageShell>
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Stack spacing={2}>
              <Typography variant="h3">Contact Phu My Hung Homes</Typography>
              <Typography color="text.secondary">Tell us your Phu My Hung rental, purchase, owner, or tenant requirement. A broker can prepare matched homes and viewing windows.</Typography>
              <Typography><strong>Zalo:</strong> +84 90 000 0000</Typography>
              <Typography><strong>WhatsApp:</strong> +84 90 000 0000</Typography>
              <Typography><strong>Office:</strong> Crescent area, Phu My Hung, District 7</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={2}>
                <TextField label="Full name" />
                <TextField label="Phone, Zalo, or WhatsApp" />
                <TextField label="Phu My Hung requirement" multiline rows={5} />
                <Button variant="contained">Send request</Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </PageShell>
  );
}

