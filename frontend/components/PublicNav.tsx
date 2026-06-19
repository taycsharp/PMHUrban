import Link from "next/link";
import { AppBar, Box, Button, Container, Stack, Toolbar, Typography } from "@mui/material";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

const links = [
  ["Rent", "/rent"],
  ["Buy", "/buy"],
  ["Projects", "/projects"],
  ["About", "/about"],
  ["Contact", "/contact"],
  ["CRM", "/login"]
];

export function PublicNav() {
  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 3, minHeight: 68 }}>
          <Stack component={Link} href="/" direction="row" alignItems="center" spacing={1} sx={{ color: "primary.main" }}>
            <HomeWorkIcon />
            <Typography variant="h6">Phu My Hung Homes</Typography>
          </Stack>
          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
            {links.map(([label, href]) => (
              <Button key={href} component={Link} href={href} color="inherit">
                {label}
              </Button>
            ))}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
