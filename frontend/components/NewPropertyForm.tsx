"use client";

import { Alert, LinearProgress, Stack, Typography } from "@mui/material";
import { PropertyUpsertForm } from "@/components/PropertyUpsertForm";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ApiProject } from "@/types/api";

export function NewPropertyForm() {
  const projects = useApiQuery<ApiProject[]>(["crm-projects"], "/projects");

  if (projects.isLoading) {
    return (
      <Stack spacing={2}>
        <LinearProgress />
        <Typography color="text.secondary">Loading Phu My Hung projects...</Typography>
      </Stack>
    );
  }

  if (projects.isError || !projects.data?.length) {
    return <Alert severity="error">Could not load Phu My Hung projects for property creation.</Alert>;
  }

  return <PropertyUpsertForm projects={projects.data} />;
}
