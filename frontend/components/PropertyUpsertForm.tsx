"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Checkbox, FormControlLabel, Grid, MenuItem, Paper, Stack, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { ApiProject, ApiProperty, ApiPropertyPayload } from "@/types/api";

const requiredFields = ["code", "slug", "title", "project_id"] as const;

function numberOrNull(value: FormDataEntryValue | null) {
  const next = Number(value || 0);
  return next > 0 ? next : null;
}

function numberOrDefault(value: FormDataEntryValue | null, fallback: number) {
  const next = Number(value || fallback);
  return Number.isFinite(next) ? next : fallback;
}

function asDateTime(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text ? new Date(text).toISOString() : null;
}

function errorMessage(error: unknown) {
  if (typeof error === "object" && error && "response" in error) {
    const response = (error as { response?: { data?: { detail?: unknown } } }).response;
    const detail = response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((item) => item?.msg).filter(Boolean).join(", ");
  }
  return "Could not save the Phu My Hung property. Check required values and API permissions.";
}

export function PropertyUpsertForm({ property, projects }: { property?: ApiProperty; projects: ApiProject[] }) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(property);
  const canWrite = user?.role !== "viewer";
  const defaultProjectId = useMemo(() => property?.project_id ?? projects[0]?.id ?? 1, [property, projects]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canWrite) {
      setError("Viewer accounts cannot save Phu My Hung properties.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const missing = requiredFields.filter((field) => !String(form.get(field) ?? "").trim());
    if (missing.length) {
      setError("Code, slug, title, and project are required.");
      setSuccess(null);
      return;
    }

    const slug = String(form.get("slug")).trim();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError("Slug must use lowercase letters, numbers, and hyphens.");
      setSuccess(null);
      return;
    }

    const payload: ApiPropertyPayload = {
      code: String(form.get("code")),
      slug,
      title: String(form.get("title")),
      listing_type: String(form.get("listing_type") || "rent") as ApiPropertyPayload["listing_type"],
      property_type: String(form.get("property_type") || "apartment") as ApiPropertyPayload["property_type"],
      status: String(form.get("status") || "draft") as ApiPropertyPayload["status"],
      project_id: Number(form.get("project_id")),
      owner_id: numberOrNull(form.get("owner_id")),
      assigned_user_id: numberOrNull(form.get("assigned_user_id")),
      address_detail: String(form.get("address_detail") || ""),
      tower_block: String(form.get("tower_block") || ""),
      floor: String(form.get("floor") || ""),
      unit_number: String(form.get("unit_number") || ""),
      bedrooms: numberOrDefault(form.get("bedrooms"), 1),
      bathrooms: numberOrDefault(form.get("bathrooms"), 1),
      area_sqm: numberOrDefault(form.get("area_sqm"), 0),
      rental_price: numberOrNull(form.get("rental_price")),
      sale_price: numberOrNull(form.get("sale_price")),
      currency: String(form.get("currency") || "VND") as ApiPropertyPayload["currency"],
      management_fee: numberOrNull(form.get("management_fee")),
      deposit_amount: numberOrNull(form.get("deposit_amount")),
      furniture_status: String(form.get("furniture_status") || "fully_furnished"),
      view_type: String(form.get("view_type") || "city"),
      balcony: Boolean(form.get("balcony")),
      pet_friendly: Boolean(form.get("pet_friendly")),
      parking: Boolean(form.get("parking")),
      available_from: asDateTime(form.get("available_from")),
      legal_status: String(form.get("legal_status") || ""),
      description_en: String(form.get("description_en") || ""),
      description_vi: String(form.get("description_vi") || ""),
      internal_notes: String(form.get("internal_notes") || ""),
      is_verified: Boolean(form.get("is_verified")),
      is_featured: Boolean(form.get("is_featured"))
    };

    setSaving(true);
    try {
      const response = isEdit ? await api.put(`/properties/${property?.id}`, payload) : await api.post("/properties", payload);
      await queryClient.invalidateQueries({ queryKey: ["crm-properties"] });
      await queryClient.invalidateQueries({ queryKey: ["crm-property", String(response.data.id)] });
      setSuccess(`${response.data.code} saved in the Phu My Hung CRM.`);
      setError(null);
      if (!isEdit) router.push(`/dashboard/properties/${response.data.id}`);
    } catch (saveError) {
      setError(errorMessage(saveError));
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
        {!canWrite && <Alert severity="info">Viewer accounts can inspect this property but cannot save changes.</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}><TextField name="code" fullWidth label="Code" defaultValue={property?.code ?? "PMH-NEW"} required /></Grid>
          <Grid item xs={12} md={3}><TextField name="slug" fullWidth label="Slug" defaultValue={property?.slug ?? "phu-my-hung-new-listing"} required /></Grid>
          <Grid item xs={12} md={6}><TextField name="title" fullWidth label="Title" defaultValue={property?.title ?? "Verified Phu My Hung home"} required /></Grid>
          <Grid item xs={12} md={3}>
            <TextField name="listing_type" select fullWidth label="Listing type" defaultValue={property?.listing_type ?? "rent"}>
              <MenuItem value="rent">Rent</MenuItem>
              <MenuItem value="sale">Sale</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField name="property_type" select fullWidth label="Property type" defaultValue={property?.property_type ?? "apartment"}>
              {["apartment", "villa", "townhouse", "shophouse", "office"].map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField name="status" select fullWidth label="Status" defaultValue={property?.status ?? "draft"}>
              {["draft", "available", "reserved", "rented", "sold", "inactive"].map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField name="project_id" select fullWidth label="Project" defaultValue={defaultProjectId} required>
              {projects.map((project) => <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={6} md={2}><TextField name="bedrooms" fullWidth label="Bedrooms" defaultValue={property?.bedrooms ?? 2} type="number" /></Grid>
          <Grid item xs={6} md={2}><TextField name="bathrooms" fullWidth label="Bathrooms" defaultValue={property?.bathrooms ?? 2} type="number" /></Grid>
          <Grid item xs={12} md={2}><TextField name="area_sqm" fullWidth label="Area m2" defaultValue={property?.area_sqm ?? 88} type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="rental_price" fullWidth label="Rental price VND" defaultValue={property?.rental_price ?? 28000000} type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="sale_price" fullWidth label="Sale price VND" defaultValue={property?.sale_price ?? ""} type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="management_fee" fullWidth label="Management fee" defaultValue={property?.management_fee ?? ""} type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="deposit_amount" fullWidth label="Deposit amount" defaultValue={property?.deposit_amount ?? ""} type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="owner_id" fullWidth label="Owner ID" defaultValue={property?.owner_id ?? ""} type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="assigned_user_id" fullWidth label="Assigned user ID" defaultValue={property?.assigned_user_id ?? ""} type="number" /></Grid>
          <Grid item xs={12} md={3}><TextField name="tower_block" fullWidth label="Tower/block" defaultValue={property?.tower_block ?? ""} /></Grid>
          <Grid item xs={6} md={1.5}><TextField name="floor" fullWidth label="Floor" defaultValue={property?.floor ?? ""} /></Grid>
          <Grid item xs={6} md={1.5}><TextField name="unit_number" fullWidth label="Unit" defaultValue={property?.unit_number ?? ""} /></Grid>
          <Grid item xs={12} md={3}><TextField name="furniture_status" fullWidth label="Furniture" defaultValue={property?.furniture_status ?? "fully_furnished"} /></Grid>
          <Grid item xs={12} md={3}><TextField name="view_type" fullWidth label="View" defaultValue={property?.view_type ?? "park"} /></Grid>
          <Grid item xs={12} md={3}><TextField name="available_from" fullWidth label="Available from" type="date" InputLabelProps={{ shrink: true }} defaultValue={property?.available_from?.slice(0, 10) ?? ""} /></Grid>
          <Grid item xs={12} md={3}><TextField name="legal_status" fullWidth label="Legal status" defaultValue={property?.legal_status ?? ""} /></Grid>
          <Grid item xs={12}><TextField name="address_detail" fullWidth label="Phu My Hung address detail" defaultValue={property?.address_detail ?? ""} /></Grid>
          <Grid item xs={12}><TextField name="description_en" fullWidth label="English public description" multiline rows={4} defaultValue={property?.description_en ?? "Verified Phu My Hung listing with owner-confirmed viewing windows."} /></Grid>
          <Grid item xs={12}><TextField name="description_vi" fullWidth label="Vietnamese public description" multiline rows={3} defaultValue={property?.description_vi ?? ""} /></Grid>
          <Grid item xs={12}><TextField name="internal_notes" fullWidth label="Internal notes" multiline rows={3} defaultValue={property?.internal_notes ?? ""} /></Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <FormControlLabel control={<Checkbox name="balcony" defaultChecked={property?.balcony ?? true} />} label="Balcony" />
              <FormControlLabel control={<Checkbox name="pet_friendly" defaultChecked={property?.pet_friendly ?? false} />} label="Pet friendly" />
              <FormControlLabel control={<Checkbox name="parking" defaultChecked={property?.parking ?? false} />} label="Parking" />
              <FormControlLabel control={<Checkbox name="is_verified" defaultChecked={property?.is_verified ?? false} />} label="Verified" />
              <FormControlLabel control={<Checkbox name="is_featured" defaultChecked={property?.is_featured ?? false} />} label="Featured" />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={saving || !canWrite}>
                {saving ? "Saving..." : isEdit ? "Save changes" : "Create property"}
              </Button>
              <Button type="reset" variant="outlined">Reset</Button>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
}
