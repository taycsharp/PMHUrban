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
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    if (!email || !password) {
      setError("Enter a Phu My Hung Homes CRM email and password.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      setError("Unable to sign in to Phu My Hung Homes CRM");
    } finally {
      setLoading(false);
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
            <TextField name="email" label="Email" defaultValue="admin@pmhhomes.local" required />
            <TextField name="password" label="Password" type="password" defaultValue="password123" required />
            <Button type="submit" variant="contained" size="large" startIcon={<LoginIcon />} disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <Alert severity="info">Demo viewer: viewer@pmhhomes.local / password123</Alert>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
