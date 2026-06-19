import { Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { DashboardShell } from "@/components/DashboardShell";
import { CrmTable } from "@/components/CrmTable";
import { properties } from "@/lib/sample-data";

export default function MatchingPage({ params }: { params: { customerId: string } }) {
  const rows = properties.slice(0, 8).map((property, index) => {
    const score = 96 - index * 6;
    return [
      property.code,
      property.title,
      <Stack key={property.id} spacing={0.5}><Typography>{score}%</Typography><LinearProgress variant="determinate" value={score} /></Stack>,
      <Stack key="reasons" direction="row" spacing={0.5} flexWrap="wrap" useFlexGap><Chip size="small" label="Budget" /><Chip size="small" label="Project" /><Chip size="small" label="Beds" /></Stack>,
      score > 80 ? "Schedule a Phu My Hung viewing" : "Review trade-offs with customer"
    ];
  });

  return (
    <DashboardShell title={`Phu My Hung matching for customer ${params.customerId}`}>
      <CrmTable columns={["Property", "Title", "Score", "Matched reasons", "Recommended next action"]} rows={rows} />
    </DashboardShell>
  );
}

