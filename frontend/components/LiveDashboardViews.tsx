"use client";

import Link from "next/link";
import { Alert, Box, Chip, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { CrmTable } from "@/components/CrmTable";
import { EmptyState } from "@/components/EmptyState";
import { useApiQuery } from "@/hooks/useApiQuery";
import {
  ApiCommission,
  ApiCustomer,
  ApiDeal,
  ApiOwner,
  ApiProject,
  ApiProperty,
  ApiRequirement,
  ApiViewing
} from "@/types/api";

const stages = ["new", "qualified", "viewing", "offer", "negotiation", "deposit", "contract", "closed_won"];

function LoadingState({ label }: { label: string }) {
  return (
    <Stack spacing={2}>
      <LinearProgress />
      <Typography color="text.secondary">{label}</Typography>
    </Stack>
  );
}

function formatMoney(value?: string | number | null, currency: "VND" | "USD" = "VND") {
  if (!value) return "Pending";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency, maximumFractionDigits: 0 }).format(Number(value));
}

function dateTime(value?: string | null) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleString("vi-VN", { dateStyle: "medium", timeStyle: "short" });
}

function latestRequirement(requirements: ApiRequirement[], customerId: number) {
  return requirements.find((requirement) => requirement.customer_id === customerId);
}

function requirementLabel(requirement?: ApiRequirement) {
  if (!requirement) return "No requirement";
  const budget = requirement.max_budget ? ` up to ${formatMoney(requirement.max_budget, requirement.currency)}` : "";
  const beds = requirement.min_bedrooms ? `, ${requirement.min_bedrooms}+ bed` : "";
  return `${requirement.listing_type}${beds}${budget}`;
}

function maps<T extends { id: number }>(items?: T[]) {
  return new Map((items ?? []).map((item) => [item.id, item]));
}

export function ProjectsTable() {
  const projects = useApiQuery<ApiProject[]>(["crm-projects"], "/projects");
  if (projects.isLoading) return <LoadingState label="Loading Phu My Hung projects..." />;
  if (projects.isError) return <Alert severity="error">Could not load Phu My Hung projects.</Alert>;
  if (!projects.data?.length) return <EmptyState title="No projects" message="Add Phu My Hung projects before publishing inventory." />;
  return (
    <CrmTable
      columns={["Project", "Address", "Amenities", "Types", "Active"]}
      rows={projects.data.map((project) => [
        project.name,
        project.address,
        project.amenities.join(", "),
        project.property_types.join(", "),
        <Chip key="active" size="small" label={project.active ? "Active" : "Inactive"} />
      ])}
    />
  );
}

export function CustomersTable() {
  const customers = useApiQuery<ApiCustomer[]>(["crm-customers"], "/customers");
  const requirements = useApiQuery<ApiRequirement[]>(["crm-requirements"], "/requirements");
  if (customers.isLoading || requirements.isLoading) return <LoadingState label="Loading Phu My Hung customers..." />;
  if (customers.isError || requirements.isError) return <Alert severity="error">Could not load customer records.</Alert>;
  if (!customers.data?.length) return <EmptyState title="No customers yet" message="Capture Phu My Hung tenant and buyer leads before running matches." />;
  return (
    <CrmTable
      columns={["Customer", "Phone", "Type", "Status", "Requirement", "Assigned"]}
      rows={customers.data.map((customer) => [
        <Link key={customer.id} href={`/dashboard/customers/${customer.id}`}>{customer.full_name}</Link>,
        customer.phone,
        customer.customer_type,
        <Chip key="status" size="small" label={customer.status} />,
        requirementLabel(latestRequirement(requirements.data ?? [], customer.id)),
        customer.assigned_user_id ? `User ${customer.assigned_user_id}` : "Team pool"
      ])}
    />
  );
}

export function CustomerDetailPanel({ customerId }: { customerId: string }) {
  const customer = useApiQuery<ApiCustomer>(["crm-customer", customerId], `/customers/${customerId}`, Boolean(customerId));
  const requirements = useApiQuery<ApiRequirement[]>(["crm-requirements"], "/requirements");
  const deals = useApiQuery<ApiDeal[]>(["crm-deals"], "/deals");
  const properties = useApiQuery<ApiProperty[]>(["crm-properties"], "/properties");
  if (customer.isLoading || requirements.isLoading || deals.isLoading || properties.isLoading) return <LoadingState label="Loading customer workspace..." />;
  if (customer.isError) return <EmptyState title="Customer not available" message="This Phu My Hung customer is missing or outside your permission scope." />;
  if (requirements.isError || deals.isError || properties.isError || !customer.data) return <Alert severity="error">Could not load customer workspace data.</Alert>;

  const propertyMap = maps(properties.data);
  const customerDeals = (deals.data ?? []).filter((deal) => deal.customer_id === customer.data.id);
  const requirement = latestRequirement(requirements.data ?? [], customer.data.id);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Typography variant="h6">Customer information</Typography>
            <Typography>{customer.data.phone}</Typography>
            {customer.data.email && <Typography>{customer.data.email}</Typography>}
            <Chip label={customer.data.status} />
            <Typography color="text.secondary">{requirementLabel(requirement)}</Typography>
            <Typography color="text.secondary">{customer.data.notes || "No notes recorded yet."}</Typography>
            <Chip component={Link} href={`/dashboard/matching/${customer.data.id}`} clickable color="primary" label="Run Phu My Hung match" />
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        <Stack spacing={2}>
          {requirement ? (
            <CrmTable
              columns={["Requirement", "Projects", "Lifestyle"]}
              rows={[[requirementLabel(requirement), requirement.preferred_projects.length || "Any Phu My Hung project", requirement.lifestyle_notes || "No lifestyle notes"]]}
            />
          ) : <EmptyState title="No search requirement" message="Add a requirement through the CRM API before matching this customer." />}
          <CrmTable
            columns={["Deal", "Property", "Stage", "Expected value"]}
            rows={customerDeals.map((deal) => [
              <Link key={deal.id} href={`/dashboard/deals/${deal.id}`}>Deal {deal.id}</Link>,
              propertyMap.get(deal.property_id)?.code ?? `Property ${deal.property_id}`,
              deal.stage,
              formatMoney(deal.expected_value)
            ])}
          />
        </Stack>
      </Grid>
    </Grid>
  );
}

export function OwnersTable() {
  const owners = useApiQuery<ApiOwner[]>(["crm-owners"], "/owners");
  const properties = useApiQuery<ApiProperty[]>(["crm-properties"], "/properties");
  if (owners.isLoading || properties.isLoading) return <LoadingState label="Loading Phu My Hung owners..." />;
  if (owners.isError || properties.isError) return <Alert severity="error">Could not load owner records.</Alert>;
  if (!owners.data?.length) return <EmptyState title="No owners yet" message="Owner records will appear here when they are added to the CRM." />;
  return (
    <CrmTable
      columns={["Owner", "Phone", "Language", "Owned properties", "Assigned"]}
      rows={owners.data.map((owner) => [
        <Link key={owner.id} href={`/dashboard/owners/${owner.id}`}>{owner.full_name}</Link>,
        owner.phone,
        owner.preferred_language,
        (properties.data ?? []).filter((property) => property.owner_id === owner.id).length,
        owner.assigned_user_id ? `User ${owner.assigned_user_id}` : "Team pool"
      ])}
    />
  );
}

export function OwnerDetailPanel({ ownerId }: { ownerId: string }) {
  const owner = useApiQuery<ApiOwner>(["crm-owner", ownerId], `/owners/${ownerId}`, Boolean(ownerId));
  const properties = useApiQuery<ApiProperty[]>(["crm-properties"], "/properties");
  if (owner.isLoading || properties.isLoading) return <LoadingState label="Loading owner workspace..." />;
  if (owner.isError) return <EmptyState title="Owner not available" message="This owner is missing or outside your permission scope." />;
  if (properties.isError || !owner.data) return <Alert severity="error">Could not load owner property data.</Alert>;
  const ownerProperties = (properties.data ?? []).filter((property) => property.owner_id === owner.data.id);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="h6">Owner information</Typography>
            <Typography>Phone: {owner.data.phone}</Typography>
            <Typography>Email: {owner.data.email ?? "Not provided"}</Typography>
            <Typography>Preferred language: {owner.data.preferred_language}</Typography>
            <Typography color="text.secondary">{owner.data.notes || "No owner notes yet."}</Typography>
            <Chip label={owner.data.assigned_user_id ? `Assigned to user ${owner.data.assigned_user_id}` : "Team pool"} />
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        {ownerProperties.length ? (
          <CrmTable
            columns={["Owned property", "Listing", "Status", "Price"]}
            rows={ownerProperties.map((property) => [
              <Link key={property.id} href={`/dashboard/properties/${property.id}`}>{property.code}</Link>,
              property.listing_type,
              property.status,
              formatMoney(property.listing_type === "sale" ? property.sale_price : property.rental_price, property.currency)
            ])}
          />
        ) : <EmptyState title="No owned properties" message="Connect this owner to Phu My Hung listings when inventory is verified." />}
      </Grid>
    </Grid>
  );
}

export function ViewingsTable() {
  const viewings = useApiQuery<ApiViewing[]>(["crm-viewings"], "/viewings");
  const customers = useApiQuery<ApiCustomer[]>(["crm-customers"], "/customers");
  const properties = useApiQuery<ApiProperty[]>(["crm-properties"], "/properties");
  if (viewings.isLoading || customers.isLoading || properties.isLoading) return <LoadingState label="Loading Phu My Hung viewings..." />;
  if (viewings.isError || customers.isError || properties.isError) return <Alert severity="error">Could not load viewings.</Alert>;
  if (!viewings.data?.length) return <EmptyState title="No viewings scheduled" message="Scheduled Phu My Hung appointments will appear here." />;
  const customerMap = maps(customers.data);
  const propertyMap = maps(properties.data);
  return (
    <CrmTable
      columns={["When", "Customer", "Property", "Meeting location", "Status", "Next follow-up"]}
      rows={viewings.data.map((viewing) => [
        dateTime(viewing.scheduled_at),
        customerMap.get(viewing.customer_id)?.full_name ?? `Customer ${viewing.customer_id}`,
        propertyMap.get(viewing.property_id)?.code ?? `Property ${viewing.property_id}`,
        viewing.meeting_location ?? "Phu My Hung Sales Gallery",
        <Chip key="status" size="small" label={viewing.status} />,
        dateTime(viewing.next_follow_up_at)
      ])}
    />
  );
}

export function DealsPipeline() {
  const deals = useApiQuery<ApiDeal[]>(["crm-deals"], "/deals");
  const customers = useApiQuery<ApiCustomer[]>(["crm-customers"], "/customers");
  const properties = useApiQuery<ApiProperty[]>(["crm-properties"], "/properties");
  if (deals.isLoading || customers.isLoading || properties.isLoading) return <LoadingState label="Loading Phu My Hung deal pipeline..." />;
  if (deals.isError || customers.isError || properties.isError) return <Alert severity="error">Could not load deal pipeline.</Alert>;
  const customerMap = maps(customers.data);
  const propertyMap = maps(properties.data);
  return (
    <Grid container spacing={1.5}>
      {stages.map((stage) => {
        const stageDeals = (deals.data ?? []).filter((deal) => deal.stage === stage);
        return (
          <Grid item xs={12} md={3} lg={1.5} key={stage}>
            <Stack spacing={1}>
              <Chip label={stage.replace("_", " ")} />
              {stageDeals.length ? stageDeals.map((deal) => (
                <Paper key={deal.id} component={Link} href={`/dashboard/deals/${deal.id}`} sx={{ p: 1.5, display: "block" }}>
                  <Typography variant="body2" fontWeight={700}>{customerMap.get(deal.customer_id)?.full_name ?? `Customer ${deal.customer_id}`}</Typography>
                  <Typography variant="caption" color="text.secondary">{propertyMap.get(deal.property_id)?.code ?? `Property ${deal.property_id}`}</Typography>
                  <Typography variant="body2" color="primary.main">{formatMoney(deal.expected_value)}</Typography>
                </Paper>
              )) : <Box sx={{ minHeight: 44 }} />}
            </Stack>
          </Grid>
        );
      })}
    </Grid>
  );
}

export function DealDetailPanel({ dealId }: { dealId: string }) {
  const deal = useApiQuery<ApiDeal>(["crm-deal", dealId], `/deals/${dealId}`, Boolean(dealId));
  const customers = useApiQuery<ApiCustomer[]>(["crm-customers"], "/customers");
  const properties = useApiQuery<ApiProperty[]>(["crm-properties"], "/properties");
  const commissions = useApiQuery<ApiCommission[]>(["crm-commissions"], "/commissions");
  if (deal.isLoading || customers.isLoading || properties.isLoading || commissions.isLoading) return <LoadingState label="Loading deal workspace..." />;
  if (deal.isError) return <EmptyState title="Deal not available" message="This Phu My Hung deal is missing or outside your permission scope." />;
  if (customers.isError || properties.isError || commissions.isError || !deal.data) return <Alert severity="error">Could not load deal workspace data.</Alert>;
  const customer = maps(customers.data).get(deal.data.customer_id);
  const property = maps(properties.data).get(deal.data.property_id);
  const dealCommissions = (commissions.data ?? []).filter((commission) => commission.deal_id === deal.data?.id);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={1}>
            <Typography variant="h6">{customer?.full_name ?? `Customer ${deal.data.customer_id}`}</Typography>
            <Typography>{property?.code ?? `Property ${deal.data.property_id}`}</Typography>
            <Chip label={deal.data.stage} />
            <Typography color="primary.main">{formatMoney(deal.data.expected_value)}</Typography>
            <Typography>Commission: {formatMoney(deal.data.commission_amount)}</Typography>
            <Typography color="text.secondary">{deal.data.notes || "No deal notes yet."}</Typography>
          </Stack>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8}>
        {dealCommissions.length ? (
          <CrmTable
            columns={["Broker", "Gross", "Company share", "Broker share", "Status"]}
            rows={dealCommissions.map((commission) => [
              `User ${commission.broker_id}`,
              formatMoney(commission.gross_commission),
              formatMoney(commission.company_share),
              formatMoney(commission.broker_share),
              <Chip key="status" size="small" label={commission.payment_status} />
            ])}
          />
        ) : <EmptyState title="No commission record" message="Commission tracking will appear after this deal is ready for payout." />}
      </Grid>
    </Grid>
  );
}

export function CommissionsTable() {
  const commissions = useApiQuery<ApiCommission[]>(["crm-commissions"], "/commissions");
  const deals = useApiQuery<ApiDeal[]>(["crm-deals"], "/deals");
  const properties = useApiQuery<ApiProperty[]>(["crm-properties"], "/properties");
  if (commissions.isLoading || deals.isLoading || properties.isLoading) return <LoadingState label="Loading Phu My Hung commissions..." />;
  if (commissions.isError || deals.isError || properties.isError) return <Alert severity="error">Could not load commissions.</Alert>;
  if (!commissions.data?.length) return <EmptyState title="No commissions yet" message="Commission records will appear when Phu My Hung deals are created." />;
  const dealMap = maps(deals.data);
  const propertyMap = maps(properties.data);
  return (
    <CrmTable
      columns={["Deal", "Broker", "Gross", "Company share", "Broker share", "Status"]}
      rows={commissions.data.map((commission) => {
        const deal = dealMap.get(commission.deal_id);
        return [
          deal ? propertyMap.get(deal.property_id)?.code ?? `Deal ${deal.id}` : `Deal ${commission.deal_id}`,
          `User ${commission.broker_id}`,
          formatMoney(commission.gross_commission),
          formatMoney(commission.company_share),
          formatMoney(commission.broker_share),
          <Chip key="status" size="small" label={commission.payment_status} />
        ];
      })}
    />
  );
}
