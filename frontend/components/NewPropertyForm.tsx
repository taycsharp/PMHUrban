"use client";

import { FormEvent, useState } from "react";
import { Alert, Button, Grid, Paper, Stack, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";

const requiredFields = ["code", "slug", "title", "project_id"] as const;

export function NewPropertyForm() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (user?.role === "viewer") {
      setError("Viewer accounts cannot create Phu My Hung properties.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const missing = requiredFields.filter((field) => !String(form.get(field) ?? "").trim());
    if (missing.length) {
      setError("Code, slug, title, and project ID are required.");
      setSuccess(null);
      return;
    }
    const rentalPrice = Number(form.get("rental_price") || 0);
    const salePrice = Number(form.get("sale_price") || 0);
    const payload = {
      code: String(form.get("code")),
      slug: String(form.get("slug")),
      title: String(form.get("title")),
      listing_type: String(form.get("listing_type") || "rent"),
      property_type: String(form.get("property_type") || "apartment"),
      status: String(form.get("status") || "draft"),
      project_id: Number(form.get("project_id")),
      bedrooms: Number(form.get("bedrooms") || 1),
      bathrooms: Number(form.get("bathrooms") || 1),
      area_sqm: Number(form.get("area_sqm") || 0),
      rental_price: rentalPrice > 0 ? rentalPrice : null,
      sale_price: salePrice > 0 ? salePrice : null,
      currency: "VND",
      furniture_status: String(form.get("furniture_status") || "fully_furnished"),
      view_type: String(form.get("view_type") || "city"),
      balcony: Boolean(form.get("balcony")),
      pet_friendly: Boolean(form.get("pet_friendly")),
      parking: Boolean(form.get("parking")),
      description_en: String(form.get("description_en") || ""),
      description_vi: String(form.get("description_vi") || ""),
      is_verified: Boolean(form.get("is_verified")),
      is_featured: Boolean(form.get("is_featured"))
    };
    setSaving(true);
    try {
      const response = await api.post("/properties", payload);
      setSuccess(`Saved ${response.data.code} to the Phu My Hung CRM.`);
      setError(null);
    } catch {
      setError("Could not save the Phu My Hung property. Check required values and API permissions.");
      setSuccess(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Paper component="form" onSubmit={onSubmit} sx={{ p: 2 }}>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}><TextField name="code" fullWidth label="Code" defaultValue="PMH-NEW" required /></Grid>
          <Grid item xs={12} md={3}><TextField name="slug" fullWidth label="Slug" defaultValue="phu-my-hung-new-listing" required /></Grid>
          <Grid item xs={12} md={6}><TextField name="title" fullWidth label="Title" defaultValue="Verified Phu My Hung home" required /></Grid>
          <Grid item xs={12} md={3}><TextField name="listing_type" fullWidth label="Listing type" defaultValue="rent" /></Grid>
          <Grid item xs={12} md={3}><TextField name="property_type" fullWidth label="Property type" defaultValue="apartment" /></Grid>
          <Grid item xs={12} md={3}><TextField name="status" fullWidth label="Status" defaultValue="draft" /></Grid>
          <Grid item xs={12} md={3}><TextField name="project_id" fullWidth label="Project ID" defaultValue="1" required /></Grid>
          <Grid item xs={6} md={2}><TextField name="bedrooms" fullWidth label="Bedrooms" defaultValue="2" type="number" /></Grid>
          <Grid item xs={6} md={2}><TextField name="bathrooms" fullWidth label="Bathrooms" defaultValue="2" type="number" /></Grid>
          <Grid item xs={12} md={2}><TextField name="area_sqm" fullWidth label="Area m2" defaultValue="88" type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="rental_price" fullWidth label="Rental price VND" defaultValue="28000000" type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="sale_price" fullWidth label="Sale price VND" type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="furniture_status" fullWidth label="Furniture" defaultValue="fully_furnished" /></Grid>
          <Grid item xs={12} md={3}><TextField name="view_type" fullWidth label="View" defaultValue="park" /></Grid>
          <Grid item xs={12}><TextField name="description_en" fullWidth label="Phu My Hung public description" multiline rows={4} defaultValue="Verified Phu My Hung listing with owner-confirmed viewing windows." /></Grid>
          <Grid item xs={12}><TextField name="description_vi" fullWidth label="Vietnamese description" multiline rows={3} /></Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving || user?.role === "viewer"}>
                {saving ? "Saving..." : "Save property"}
              </Button>
              <Button type="reset" variant="outlined">Reset</Button>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}

