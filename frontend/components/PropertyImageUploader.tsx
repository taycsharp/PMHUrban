"use client";

import { ChangeEvent, useState } from "react";
import { Alert, Box, Button, Chip, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useQueryClient } from "@tanstack/react-query";
import { uploadPropertyImages } from "@/lib/property-images";
import { ApiProperty } from "@/types/api";

function selectedFiles(event: ChangeEvent<HTMLInputElement>) {
  return Array.from(event.target.files ?? []).filter((file) => file.size > 0);
}

export function PropertyImageUploader({ property, canWrite }: { property: ApiProperty; canWrite: boolean }) {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onUpload() {
    if (!files.length) {
      setError("Choose at least one JPG, PNG, or WebP image.");
      return;
    }
    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      await uploadPropertyImages(property.id, files, caption, property.images.length === 0);
      await queryClient.invalidateQueries({ queryKey: ["crm-property", String(property.id)] });
      await queryClient.invalidateQueries({ queryKey: ["crm-properties"] });
      setFiles([]);
      setCaption("");
      setMessage(`${files.length} image${files.length === 1 ? "" : "s"} uploaded locally.`);
    } catch {
      setError("Could not upload the selected image files. Check file type, size, and API permissions.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1} alignItems={{ xs: "flex-start", md: "center" }}>
          <Stack sx={{ flex: 1 }}>
            <Typography variant="h6">Property images</Typography>
            <Typography color="text.secondary">Local uploads are served from the backend upload folder.</Typography>
          </Stack>
          <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateIcon />} disabled={!canWrite || uploading}>
            Choose images
            <input hidden type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setFiles(selectedFiles(event))} />
          </Button>
          <Button variant="contained" startIcon={<CloudUploadIcon />} disabled={!canWrite || uploading || !files.length} onClick={onUpload}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Stack>
        {message && <Alert severity="success">{message}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        {!canWrite && <Alert severity="info">Viewer accounts can inspect images but cannot upload new files.</Alert>}
        <TextField
          size="small"
          label="Caption for uploaded images"
          value={caption}
          disabled={!canWrite || uploading}
          onChange={(event) => setCaption(event.target.value)}
        />
        {files.length > 0 && <Typography color="text.secondary">{files.map((file) => file.name).join(", ")}</Typography>}
        {property.images.length ? (
          <Grid container spacing={1.5}>
            {property.images.map((image) => (
              <Grid item xs={12} sm={6} md={3} key={image.id}>
                <Box sx={{ aspectRatio: "4 / 3", borderRadius: 1, backgroundImage: `url(${image.image_url})`, backgroundSize: "cover", backgroundPosition: "center", position: "relative", bgcolor: "grey.100" }}>
                  {image.is_cover && <Chip size="small" label="Cover" color="primary" sx={{ position: "absolute", top: 8, left: 8 }} />}
                </Box>
                <Typography variant="caption" color="text.secondary">{image.caption || "Property image"}</Typography>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 2, border: "1px dashed", borderColor: "divider", bgcolor: "background.default" }}>
            <Typography color="text.secondary">No local images uploaded yet.</Typography>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
