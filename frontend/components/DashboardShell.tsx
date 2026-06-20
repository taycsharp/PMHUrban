"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Container, Divider, Stack, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import HandshakeIcon from "@mui/icons-material/Handshake";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/contexts/auth-context";

const nav = [
  ["Dashboard", "/dashboard", <DashboardIcon key="i" />],
  ["Properties", "/dashboard/properties", <HomeWorkIcon key="i" />],
  ["Owners", "/dashboard/owners", <PeopleIcon key="i" />],
  ["Customers", "/dashboard/customers", <PeopleIcon key="i" />],
  ["Viewings", "/dashboard/viewings", <CalendarMonthIcon key="i" />],
  ["Deals", "/dashboard/deals", <HandshakeIcon key="i" />],
  ["Commissions", "/dashboard/commissions", <HandshakeIcon key="i" />],
  ["Users", "/dashboard/users", <PeopleIcon key="i" />],
  ["Settings", "/dashboard/settings", <SettingsIcon key="i" />]
];

export function DashboardShell({ title, children }: { title: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (ready && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, ready, router]);

  if (!ready || !isAuthenticated) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "background.default" }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography color="text.secondary">Checking Phu My Hung Homes CRM access...</Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "260px 1fr" } }}>
        <Box sx={{ bgcolor: "primary.dark", color: "white", minHeight: { md: "100vh" }, p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <HomeWorkIcon />
            <Typography variant="h6">Phu My Hung Homes CRM</Typography>
          </Stack>
          <Divider sx={{ borderColor: "rgba(255,255,255,.2)", mb: 2 }} />
          <Stack spacing={0.75}>
            {nav.map(([label, href, icon]) => (
              <Button
                key={href as string}
                component={Link}
                href={href as string}
                startIcon={icon}
                sx={{
                  justifyContent: "flex-start",
                  color: "white",
                  bgcolor: pathname === href ? "rgba(255,255,255,.16)" : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,.12)" }
                }}
              >
                {label}
              </Button>
            ))}
          </Stack>
          <Box sx={{ mt: 3, p: 1.5, border: "1px solid rgba(255,255,255,.18)", borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,.72)" }}>Signed in as</Typography>
            <Typography variant="subtitle2">{user?.full_name}</Typography>
            <Chip size="small" label={user?.role} sx={{ mt: 1, bgcolor: "secondary.light" }} />
            <Button
              fullWidth
              startIcon={<LogoutIcon />}
              sx={{ mt: 1.5, color: "white", justifyContent: "flex-start" }}
              onClick={() => {
                logout();
                router.replace("/login");
              }}
            >
              Sign out
            </Button>
          </Box>
        </Box>
        <Box>
          <Box sx={{ bgcolor: "white", borderBottom: "1px solid", borderColor: "divider", py: 2 }}>
            <Container maxWidth="xl">
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" spacing={1}>
                <Typography variant="h5">{title}</Typography>
                {user?.role === "viewer" && <Chip color="warning" label="Viewer role: read-only CRM access" />}
              </Stack>
            </Container>
          </Box>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            {user?.role === "viewer" && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Viewer accounts can inspect permitted Phu My Hung CRM data, but backend write APIs reject create, update, and delete actions.
              </Alert>
            )}
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
