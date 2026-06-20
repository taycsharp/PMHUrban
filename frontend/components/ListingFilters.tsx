import Link from "next/link";
import { Button, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { PropertySearchFilters } from "@/lib/backend-data";
import { ListingType, Project } from "@/types";

export function ListingFilters({ listingType, projects, values }: { listingType: ListingType; projects: Project[]; values: PropertySearchFilters }) {
  const path = listingType === "rent" ? "/rent" : "/buy";
  return (
    <Paper component="form" action={path} method="get" sx={{ p: 2, position: { md: "sticky" }, top: 88 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Phu My Hung filters</Typography>
        <TextField name="q" size="small" fullWidth label="Keyword" defaultValue={values.q ?? ""} />
        <TextField name="project" select size="small" fullWidth label="Project/building" defaultValue={values.project ?? ""}>
          <MenuItem value="">Any Phu My Hung project</MenuItem>
          {projects.map((project) => <MenuItem key={project.slug} value={project.slug}>{project.name}</MenuItem>)}
        </TextField>
        <TextField name="property_type" select size="small" fullWidth label="Property type" defaultValue={values.propertyType ?? ""}>
          <MenuItem value="">Any type</MenuItem>
          <MenuItem value="apartment">Apartment</MenuItem>
          <MenuItem value="villa">Villa</MenuItem>
          <MenuItem value="townhouse">Townhouse</MenuItem>
          <MenuItem value="shophouse">Shophouse</MenuItem>
          <MenuItem value="office">Office</MenuItem>
        </TextField>
        <Grid container spacing={1}>
          <Grid item xs={6}><TextField name="bedrooms" size="small" label="Min beds" defaultValue={values.bedrooms ?? ""} type="number" fullWidth inputProps={{ min: 1 }} /></Grid>
          <Grid item xs={6}><TextField name="bathrooms" size="small" label="Min baths" defaultValue={values.bathrooms ?? ""} type="number" fullWidth inputProps={{ min: 1 }} /></Grid>
          <Grid item xs={6}><TextField name="min_area" size="small" label="Min m2" defaultValue={values.minArea ?? ""} type="number" fullWidth inputProps={{ min: 1 }} /></Grid>
          <Grid item xs={6}><TextField name="max_area" size="small" label="Max m2" defaultValue={values.maxArea ?? ""} type="number" fullWidth inputProps={{ min: 1 }} /></Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={6}><TextField name="min_price" size="small" label={listingType === "rent" ? "Min M/mo" : "Min B"} defaultValue={values.minPrice ?? ""} type="number" fullWidth inputProps={{ min: 1 }} /></Grid>
          <Grid item xs={6}><TextField name="max_price" size="small" label={listingType === "rent" ? "Max M/mo" : "Max B"} defaultValue={values.maxPrice ?? ""} type="number" fullWidth inputProps={{ min: 1 }} /></Grid>
        </Grid>
        <TextField name="furniture_status" select size="small" fullWidth label="Furniture" defaultValue={values.furnitureStatus ?? ""}>
          <MenuItem value="">Any</MenuItem>
          <MenuItem value="unfurnished">Unfurnished</MenuItem>
          <MenuItem value="basic">Basic</MenuItem>
          <MenuItem value="fully_furnished">Fully furnished</MenuItem>
          <MenuItem value="luxury">Luxury</MenuItem>
        </TextField>
        <TextField name="view_type" select size="small" fullWidth label="View" defaultValue={values.viewType ?? ""}>
          <MenuItem value="">Any</MenuItem>
          {["river", "park", "city", "garden", "pool", "street"].map((view) => <MenuItem key={view} value={view}>{view}</MenuItem>)}
        </TextField>
        <TextField name="verified_only" select size="small" fullWidth label="Verification" defaultValue={values.verifiedOnly === false ? "false" : "true"}>
          <MenuItem value="true">Verified only</MenuItem>
          <MenuItem value="false">Show all public listings</MenuItem>
        </TextField>
        <Grid container spacing={1}>
          <Grid item xs={4}><TextField name="pet_friendly" select size="small" fullWidth label="Pets" defaultValue={values.petFriendly === true ? "true" : ""}><MenuItem value="">Any</MenuItem><MenuItem value="true">Yes</MenuItem></TextField></Grid>
          <Grid item xs={4}><TextField name="balcony" select size="small" fullWidth label="Balcony" defaultValue={values.balcony === true ? "true" : ""}><MenuItem value="">Any</MenuItem><MenuItem value="true">Yes</MenuItem></TextField></Grid>
          <Grid item xs={4}><TextField name="parking" select size="small" fullWidth label="Parking" defaultValue={values.parking === true ? "true" : ""}><MenuItem value="">Any</MenuItem><MenuItem value="true">Yes</MenuItem></TextField></Grid>
        </Grid>
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="contained" startIcon={<SearchIcon />} fullWidth>Apply</Button>
          <Button component={Link} href={path} variant="outlined" startIcon={<RestartAltIcon />}>Reset</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
