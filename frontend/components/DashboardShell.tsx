import Link from "next/link";
import { Box, Button, Container, Divider, Stack, Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import HandshakeIcon from "@mui/icons-material/Handshake";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SettingsIcon from "@mui/icons-material/Settings";

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
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "260px 1fr" } }}>
        <Box sx={{ bgcolor: "primary.dark", color: "white", minHeight: { md: "100vh" }, p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <HomeWorkIcon />
            <Typography variant="h6">Phu My Hung Homes CRM</Typography>
          </Stack>
          <Divider sx={{ borderColor: "rgba(255,255,255,.2)", mb: 2 }} />
          <Stack spacing={0.5}>
            {nav.map(([label, href, icon]) => (
              <Button key={href as string} component={Link} href={href as string} startIcon={icon} sx={{ justifyContent: "flex-start", color: "white" }}>
                {label}
              </Button>
            ))}
          </Stack>
        </Box>
        <Box>
          <Box sx={{ bgcolor: "white", borderBottom: "1px solid", borderColor: "divider", py: 2 }}>
            <Container maxWidth="xl">
              <Typography variant="h5">{title}</Typography>
            </Container>
          </Box>
          <Container maxWidth="xl" sx={{ py: 3 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

