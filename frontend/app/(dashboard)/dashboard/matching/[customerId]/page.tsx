import { DashboardShell } from "@/components/DashboardShell";
import { MatchingResults } from "@/components/MatchingResults";

export default function MatchingPage({ params }: { params: { customerId: string } }) {
  return (
    <DashboardShell title={`Phu My Hung matching for customer ${params.customerId}`}>
      <MatchingResults customerId={params.customerId} />
    </DashboardShell>
  );
}
