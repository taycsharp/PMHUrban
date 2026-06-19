import { Button, Grid, Paper, Stack, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { DashboardShell } from "@/components/DashboardShell";

export default function NewPropertyPage() {
  return (
    <DashboardShell title="New Phu My Hung property">
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {["Code", "Title", "Project/building", "Owner", "Bedrooms", "Bathrooms", "Area m2", "Rental price", "Sale price", "Availability date"].map((label) => (
            <Grid item xs={12} md={4} key={label}><TextField fullWidth label={label} /></Grid>
          ))}
          <Grid item xs={12}><TextField fullWidth label="Phu My Hung public description" multiline rows={5} /></Grid>
          <Grid item xs={12}><Stack direction="row" spacing={1}><Button variant="contained" startIcon={<SaveIcon />}>Save property</Button><Button variant="outlined">Save draft</Button></Stack></Grid>
        </Grid>
      </Paper>
    </DashboardShell>
  );
}

