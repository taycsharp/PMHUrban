"use client";

import { Alert, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { EmptyState } from "@/components/EmptyState";
import { CrmTable } from "@/components/CrmTable";
import { useApiQuery } from "@/hooks/useApiQuery";

type MatchResult = {
  property: {
    code: string;
    title: string;
    project_id: number;
    bedrooms: number;
    rental_price?: string | null;
    sale_price?: string | null;
  };
  score: number;
  matched_reasons: string[];
  missing_criteria: string[];
  recommended_next_action: string;
};

export function MatchingResults({ customerId }: { customerId: string }) {
  const { data, isLoading, isError, error } = useApiQuery<MatchResult[]>(["matching", customerId], `/matching/${customerId}`);

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <LinearProgress />
        <Typography color="text.secondary">Scoring available Phu My Hung properties...</Typography>
      </Stack>
    );
  }

  if (isError) {
    return <Alert severity="warning">{error instanceof Error ? error.message : "Could not load Phu My Hung matches for this customer."}</Alert>;
  }

  if (!data?.length) {
    return <EmptyState title="No Phu My Hung matches yet" message="Add a customer requirement and verify available properties to generate matches." />;
  }

  return (
    <CrmTable
      columns={["Property", "Title", "Score", "Matched reasons", "Missing criteria", "Recommended next action"]}
      rows={data.map((match) => [
        match.property.code,
        match.property.title,
        <Stack key={`${match.property.code}-score`} spacing={0.5}><Typography>{match.score}%</Typography><LinearProgress variant="determinate" value={match.score} /></Stack>,
        <Stack key={`${match.property.code}-reasons`} direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {match.matched_reasons.slice(0, 3).map((reason) => <Chip key={reason} size="small" label={reason} />)}
        </Stack>,
        <Typography key={`${match.property.code}-missing`} color="text.secondary" variant="body2">{match.missing_criteria.slice(0, 2).join(", ") || "None"}</Typography>,
        match.recommended_next_action
      ])}
    />
  );
}

