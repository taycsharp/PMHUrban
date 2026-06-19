import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { projects } from "@/lib/sample-data";

export function SearchPanel() {
  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Grid container spacing={1.5}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Intent</InputLabel>
            <Select defaultValue="rent" label="Intent">
              <MenuItem value="rent">Rent</MenuItem>
              <MenuItem value="sale">Buy</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select defaultValue="apartment" label="Type">
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="villa">Villa</MenuItem>
              <MenuItem value="townhouse">Townhouse</MenuItem>
              <MenuItem value="shophouse">Shophouse</MenuItem>
              <MenuItem value="office">Office</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Project</InputLabel>
            <Select defaultValue="Midtown" label="Project">
              {projects.slice(0, 8).map((project) => (
                <MenuItem key={project.slug} value={project.name}>{project.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={1.5}>
          <TextField fullWidth size="small" label="Beds" defaultValue="2+" />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField fullWidth size="small" label="Budget" defaultValue="30M VND" />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <Button fullWidth variant="contained" startIcon={<SearchIcon />} sx={{ height: 40 }}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

