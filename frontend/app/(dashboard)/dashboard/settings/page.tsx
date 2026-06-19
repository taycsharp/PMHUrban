import { Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { DashboardShell } from "@/components/DashboardShell";

export default function SettingsPage() {
  return (
    <DashboardShell title="Phu My Hung settings">
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Company profile</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}><TextField fullWidth label="Company name" defaultValue="Phu My Hung Homes" /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Phone" defaultValue="+84 28 5411 0000" /></Grid>
            <Grid item xs={12} md={4}><TextField fullWidth label="Email" defaultValue="hello@pmhhomes.local" /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="Zalo" defaultValue="+84 90 000 0000" /></Grid>
            <Grid item xs={12} md={6}><TextField fullWidth label="WhatsApp" defaultValue="+84 90 000 0000" /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Address" defaultValue="Crescent area, Phu My Hung, District 7, Ho Chi Minh City" /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Public website SEO title" defaultValue="Phu My Hung Homes CRM - Verified Rentals and Sales" /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Public website SEO description" defaultValue="Specialized Phu My Hung property portal and broker CRM." /></Grid>
          </Grid>
          <Button variant="contained" startIcon={<SaveIcon />} sx={{ alignSelf: "flex-start" }}>Save settings</Button>
        </Stack>
      </Paper>
    </DashboardShell>
  );
}

