import { Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Paper, Select, Slider, Stack, TextField, Typography } from "@mui/material";
import { projects } from "@/lib/sample-data";

export function ListingFilters({ listingType }: { listingType: "rent" | "sale" }) {
  return (
    <Paper sx={{ p: 2, position: { md: "sticky" }, top: 88 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Phu My Hung filters</Typography>
        <FormControl size="small" fullWidth>
          <InputLabel>Project/building</InputLabel>
          <Select defaultValue="" label="Project/building">
            <MenuItem value="">Any Phu My Hung project</MenuItem>
            {projects.map((project) => <MenuItem key={project.slug} value={project.slug}>{project.name}</MenuItem>)}
          </Select>
        </FormControl>
        <Grid container spacing={1}>
          <Grid item xs={6}><TextField size="small" label="Bedrooms" defaultValue="2+" fullWidth /></Grid>
          <Grid item xs={6}><TextField size="small" label="Bathrooms" defaultValue="1+" fullWidth /></Grid>
          <Grid item xs={6}><TextField size="small" label="Min m2" fullWidth /></Grid>
          <Grid item xs={6}><TextField size="small" label="Max m2" fullWidth /></Grid>
        </Grid>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">{listingType === "rent" ? "Rental price" : "Sale price"}</Typography>
          <Slider defaultValue={listingType === "rent" ? [20, 60] : [4, 12]} min={listingType === "rent" ? 10 : 2} max={listingType === "rent" ? 120 : 25} valueLabelDisplay="auto" />
        </Stack>
        <FormControl size="small" fullWidth>
          <InputLabel>Furniture</InputLabel>
          <Select defaultValue="" label="Furniture">
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="unfurnished">Unfurnished</MenuItem>
            <MenuItem value="basic">Basic</MenuItem>
            <MenuItem value="fully_furnished">Fully furnished</MenuItem>
            <MenuItem value="luxury">Luxury</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" fullWidth>
          <InputLabel>View</InputLabel>
          <Select defaultValue="" label="View">
            {["Any", "River", "Park", "City", "Garden", "Pool", "Street"].map((view) => <MenuItem key={view} value={view.toLowerCase()}>{view}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Verified only" />
        <FormControlLabel control={<Checkbox />} label="Pet friendly" />
        <FormControlLabel control={<Checkbox />} label="Balcony" />
        <FormControlLabel control={<Checkbox />} label="Parking" />
      </Stack>
    </Paper>
  );
}

