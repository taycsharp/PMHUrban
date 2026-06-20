"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Button, Chip, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { EmptyState } from "@/components/EmptyState";
import { PropertyImageUploader } from "@/components/PropertyImageUploader";
import { PropertyUpsertForm } from "@/components/PropertyUpsertForm";
import { useAuth } from "@/contexts/auth-context";
import { useApiQuery } from "@/hooks/useApiQuery";
import { api } from "@/lib/api";
import { ApiProject, ApiProperty } from "@/types/api";

function formatMoney(value: ApiProperty["rental_price"], currency: ApiProperty["currency"]) {
  if (!value) return "Price pending";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value));
}

export function PropertyDetailPanel({ propertyId }: { propertyId: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const property = useApiQuery<ApiProperty>(["crm-property", propertyId], `/properties/${propertyId}`, Boolean(propertyId));
  const projects = useApiQuery<ApiProject[]>(["crm-projects"], "/projects");
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canWrite = user?.role !== "viewer";

  async function archiveProperty() {
    if (!property.data || !canWrite) return;
    const confirmed = window.confirm(`Archive ${property.data.code}? This keeps CRM history and removes it from active inventory.`);
    if (!confirmed) return;
    setArchiving(true);
    setError(null);
    try {
      await api.delete(`/properties/${property.data.id}`);
      await queryClient.invalidateQueries({ queryKey: ["crm-properties"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      router.push("/dashboard/properties");
    } catch {
      setError("Could not archive this Phu My Hung property. Check your role and API connection.");
    } finally {
      setArchiving(false);
    }
  }

  if (property.isLoading || projects.isLoading) {
    return (
      <Stack spacing={2}>
        <LinearProgress />
        <Typography color="text.secondary">Loading Phu My Hung property detail...</Typography>
      </Stack>
    );
  }

  if (property.isError) {
    return <EmptyState title="Property not available" message="This property may have been archived or your account may not have permission to view it." />;
  }

  if (projects.isError || !projects.data?.length) {
    return <Alert severity="error">Could not load Phu My Hung projects for editing.</Alert>;
  }

  if (!property.data) {
    return <EmptyState title="Property not found" message="Choose another property from the Phu My Hung inventory list." />;
  }

  const project = projects.data.find((item) => item.id === property.data.project_id);
  const activePrice = property.data.listing_type === "sale" ? property.data.sale_price : property.data.rental_price;

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ xs: "stretch", md: "center" }}>
        <Button component={Link} href="/dashboard/properties" startIcon={<ArrowBackIcon />} variant="outlined">Back</Button>
        <Chip label={property.data.status} color={property.data.status === "available" ? "success" : "primary"} sx={{ alignSelf: { xs: "flex-start", md: "center" } }} />
        {property.data.is_verified && <Chip label="Verified" sx={{ alignSelf: { xs: "flex-start", md: "center" } }} />}
        <Stack sx={{ flex: 1 }} />
        <Button color="error" startIcon={<DeleteOutlineIcon />} disabled={!canWrite || archiving} onClick={archiveProperty}>
          {archiving ? "Archiving..." : "Archive property"}
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography variant="h5">{property.data.title}</Typography>
              <Typography color="primary.main" fontWeight={700}>{formatMoney(activePrice, property.data.currency)}</Typography>
              <Typography color="text.secondary">{property.data.description_en || "No public description has been added yet."}</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={project?.name ?? "Project pending"} />
                <Chip label={`${Number(property.data.area_sqm).toLocaleString("vi-VN")} m2`} />
                <Chip label={`${property.data.bedrooms} bedrooms`} />
                <Chip label={property.data.furniture_status} />
                {property.data.view_type && <Chip label={`${property.data.view_type} view`} />}
              </Stack>
            </Stack>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Stack spacing={1}>
              <Typography variant="h6">Internal checks</Typography>
              <Typography color="text.secondary">Owner ID: {property.data.owner_id ?? "Not assigned"}</Typography>
              <Typography color="text.secondary">Broker ID: {property.data.assigned_user_id ?? "Team pool"}</Typography>
              <Typography color="text.secondary">Updated: {new Date(property.data.updated_at).toLocaleDateString("vi-VN")}</Typography>
              <Typography color="text.secondary">{property.data.internal_notes || "No internal notes yet."}</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <PropertyUpsertForm property={property.data} projects={projects.data} />
      <PropertyImageUploader property={property.data} canWrite={canWrite} />
    </Stack>
  );
}
