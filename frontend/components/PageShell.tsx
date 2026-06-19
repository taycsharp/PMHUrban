import { Box } from "@mui/material";
import { PublicNav } from "@/components/PublicNav";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <PublicNav />
      {children}
    </Box>
  );
}

