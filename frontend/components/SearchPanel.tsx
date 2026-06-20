"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Grid, MenuItem, Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Project } from "@/types";

export function SearchPanel({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [intent, setIntent] = useState<"rent" | "sale">("rent");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    for (const [key, value] of data.entries()) {
      const text = String(value).trim();
      if (key !== "intent" && text) params.set(key, text);
    }
    router.push(`/${intent === "sale" ? "buy" : "rent"}${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <Paper component="form" onSubmit={onSubmit} sx={{ p: 2, borderRadius: 2 }}>
      <Grid container spacing={1.5}>
        <Grid item xs={12} md={2}>
          <TextField select name="intent" fullWidth size="small" label="Intent" value={intent} onChange={(event) => setIntent(event.target.value as "rent" | "sale")}>
            <MenuItem value="rent">Rent</MenuItem>
            <MenuItem value="sale">Buy</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField select name="property_type" fullWidth size="small" label="Type" defaultValue="">
            <MenuItem value="">Any type</MenuItem>
            <MenuItem value="apartment">Apartment</MenuItem>
            <MenuItem value="villa">Villa</MenuItem>
            <MenuItem value="townhouse">Townhouse</MenuItem>
            <MenuItem value="shophouse">Shophouse</MenuItem>
            <MenuItem value="office">Office</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField select name="project" fullWidth size="small" label="Project" defaultValue="">
            <MenuItem value="">Any Phu My Hung project</MenuItem>
            {projects.slice(0, 8).map((project) => <MenuItem key={project.slug} value={project.slug}>{project.name}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={6} md={1.5}>
          <TextField name="bedrooms" fullWidth size="small" label="Min beds" type="number" inputProps={{ min: 1 }} />
        </Grid>
        <Grid item xs={6} md={2}>
          <TextField name="max_price" fullWidth size="small" type="number" label={intent === "rent" ? "Max M VND/mo" : "Max B VND"} inputProps={{ min: 1 }} />
        </Grid>
        <Grid item xs={12} md={1.5}>
          <Button fullWidth type="submit" variant="contained" startIcon={<SearchIcon />} sx={{ height: 40 }}>
            Search
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
