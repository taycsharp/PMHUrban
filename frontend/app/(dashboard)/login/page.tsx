"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useAuth } from "@/contexts/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await login(String(data.get("email")), String(data.get("password")));
      router.push("/dashboard");
    } catch {
      setError("Unable to sign in to Phu My Hung Homes CRM");
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "primary.dark", display: "grid", placeItems: "center", p: 2 }}>
      <Container maxWidth="sm">
        <Paper component="form" onSubmit={onSubmit} sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h4">Phu My Hung Homes CRM</Typography>
            <Typography color="text.secondary">Broker workspace for verified Phu My Hung properties, owners, customers, viewings, and deals.</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField name="email" label="Email" defaultValue="admin@pmhhomes.local" />
            <TextField name="password" label="Password" type="password" defaultValue="password123" />
            <Button type="submit" variant="contained" size="large" startIcon={<LoginIcon />}>Sign in</Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

