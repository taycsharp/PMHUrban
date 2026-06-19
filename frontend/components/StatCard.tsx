import { Card, CardContent, Stack, Typography } from "@mui/material";

export function StatCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography color="text.secondary" variant="body2">{label}</Typography>
          <Typography variant="h4" color="primary.main">{value}</Typography>
          <Typography color="text.secondary" variant="body2">{detail}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

