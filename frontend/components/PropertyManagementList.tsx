"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useQueryClient } from "@tanstack/react-query";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/contexts/auth-context";
import { useApiQuery } from "@/hooks/useApiQuery";
import { api } from "@/lib/api";
import { ApiProject, ApiProperty } from "@/types/api";

const statusOptions = ["all", "draft", "available", "reserved", "rented", "sold", "inactive"];
const listingOptions = ["all", "rent", "sale"];

function formatPrice(property: ApiProperty) {
  const amount = property.listing_type === "sale" ? property.sale_price : property.rental_price;
  if (!amount) return "Price pending";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: property.currency, maximumFractionDigits: 0 }).format(Number(amount));
}

function statusColor(status: ApiProperty["status"]) {
  if (status === "available") return "success";
  if (status === "reserved") return "warning";
  if (status === "inactive") return "default";
  return "primary";
}

export function PropertyManagementList() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const properties = useApiQuery<ApiProperty[]>(["crm-properties"], "/properties");
  const projects = useApiQuery<ApiProject[]>(["crm-projects"], "/projects");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [listingType, setListingType] = useState("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canWrite = user?.role !== "viewer";

  const projectNames = useMemo(() => {
    return new Map((projects.data ?? []).map((project) => [project.id, project.name]));
  }, [projects.data]);

  const filteredProperties = useMemo(() => {
    const text = query.trim().toLowerCase();
    return (properties.data ?? []).filter((property) => {
      const matchesText = !text || [property.code, property.title, property.tower_block, projectNames.get(property.project_id)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(text));
      const matchesStatus = status === "all" || property.status === status;
      const matchesListing = listingType === "all" || property.listing_type === listingType;
      return matchesText && matchesStatus && matchesListing;
    });
  }, [listingType, properties.data, projectNames, query, status]);

  async function deleteProperty(property: ApiProperty) {
    if (!canWrite) {
      setError("Viewer accounts cannot archive Phu My Hung properties.");
      return;
    }
    const confirmed = window.confirm(`Archive ${property.code}? This keeps the record but removes it from active Phu My Hung inventory.`);
    if (!confirmed) return;
    setDeletingId(property.id);
    setError(null);
    try {
      await api.delete(`/properties/${property.id}`);
      await queryClient.invalidateQueries({ queryKey: ["crm-properties"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    } catch {
      setError("Could not archive this property. Check your role and API connection.");
    } finally {
      setDeletingId(null);
    }
  }

  if (properties.isLoading || projects.isLoading) {
    return (
      <Stack spacing={2}>
        <LinearProgress />
        <Typography color="text.secondary">Loading Phu My Hung property inventory...</Typography>
      </Stack>
    );
  }

  if (properties.isError || projects.isError) {
    return <Alert severity="error">Could not load Phu My Hung properties. Please confirm the backend is running and your session is valid.</Alert>;
  }

  return (
    <Stack spacing={2}>
      {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
      {!canWrite && <Alert severity="info">Viewer accounts can inspect properties, but create, edit, and archive actions are disabled.</Alert>}
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ xs: "stretch", md: "center" }}>
        <TextField
          size="small"
          label="Search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          sx={{ minWidth: { md: 320 } }}
        />
        <TextField size="small" select label="Status" value={status} onChange={(event) => setStatus(event.target.value)} sx={{ minWidth: 150 }}>
          {statusOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
        </TextField>
        <TextField size="small" select label="Listing" value={listingType} onChange={(event) => setListingType(event.target.value)} sx={{ minWidth: 150 }}>
          {listingOptions.map((option) => <MenuItem key={option} value={option}>{option}</MenuItem>)}
        </TextField>
        <Box sx={{ flex: 1 }} />
        <Button component={Link} href="/dashboard/properties/new" variant="contained" startIcon={<AddIcon />} disabled={!canWrite}>
          New property
        </Button>
      </Stack>

      {!properties.data?.length ? (
        <EmptyState title="No Phu My Hung properties yet" message="Create the first verified listing before matching customers or publishing inventory." />
      ) : !filteredProperties.length ? (
        <EmptyState title="No properties match these filters" message="Try another project code, listing type, or availability status." />
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Code</TableCell>
                <TableCell>Property</TableCell>
                <TableCell>Project</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Flags</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id} hover>
                  <TableCell>
                    <Link href={`/dashboard/properties/${property.id}`}>{property.code}</Link>
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.25}>
                      <Typography variant="body2" fontWeight={700}>{property.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {property.bedrooms} bed / {property.bathrooms} bath / {Number(property.area_sqm).toLocaleString("vi-VN")} m2
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{projectNames.get(property.project_id) ?? "Project pending"}</TableCell>
                  <TableCell>{formatPrice(property)}</TableCell>
                  <TableCell><Chip size="small" color={statusColor(property.status)} label={property.status} /></TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {property.is_verified && <Chip size="small" label="Verified" />}
                      {property.is_featured && <Chip size="small" label="Featured" />}
                      {property.parking && <Chip size="small" label="Parking" />}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Button component={Link} href={`/dashboard/properties/${property.id}`} size="small" startIcon={<OpenInNewIcon />}>Open</Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteOutlineIcon />}
                        disabled={!canWrite || deletingId === property.id}
                        onClick={() => deleteProperty(property)}
                      >
                        {deletingId === property.id ? "Archiving..." : "Archive"}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
}
