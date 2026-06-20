"use client";

import { FormEvent, useMemo, useState } from "react";
import { Alert, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Property } from "@/types";

export function PropertyInquiryForm({ property }: { property: Property }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultMessage = useMemo(() => `I want to view ${property.code} in Phu My Hung.`, [property.code]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (name.length < 2 || phone.length < 6) {
      setError("Please add a name and reachable phone, Zalo, or WhatsApp number.");
      setSubmitted(false);
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  return (
    <Paper component="form" onSubmit={onSubmit} sx={{ p: 2, position: { md: "sticky" }, top: 88 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Contact Phu My Hung Homes</Typography>
        {submitted && <Alert severity="success">Inquiry drafted for the Phu My Hung broker team.</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField name="name" label="Full name" size="small" required />
        <TextField name="phone" label="Phone, Zalo, or WhatsApp" size="small" required />
        <TextField name="message" label="Message" multiline rows={4} defaultValue={defaultMessage} />
        <Button type="submit" variant="contained" startIcon={<SendIcon />}>Request viewing</Button>
      </Stack>
    </Paper>
  );
}

