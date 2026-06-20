import { Paper, Stack, Typography } from "@mui/material";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <Paper sx={{ p: 3, border: "1px dashed", borderColor: "divider", bgcolor: "background.default" }}>
      <Stack spacing={0.5}>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{message}</Typography>
      </Stack>
    </Paper>
  );
}

