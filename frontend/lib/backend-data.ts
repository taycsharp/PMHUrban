import { projects as fallbackProjects, properties as fallbackProperties } from "@/lib/sample-data";
import { ListingType, Project, Property } from "@/types";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

type BackendImage = {
  image_url: string;
  caption?: string | null;
  is_cover?: boolean;
};

type BackendProject = {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  property_types: string[];
  amenities: string[];
  nearby_places: string[];
  images: string[];
};

type BackendProperty = {
  id: number;
  code: string;
  slug: string;
  title: string;
  listing_type: "rent" | "sale";
  property_type: Property["propertyType"];
  status: string;
  project_id: number;
  bedrooms: number;
  bathrooms: number;
  area_sqm: string | number;
  rental_price?: string | number | null;
  sale_price?: string | number | null;
  currency: "VND" | "USD";
  furniture_status: string;
  view_type?: string | null;
  balcony: boolean;
  pet_friendly: boolean;
  parking: boolean;
  available_from?: string | null;
  description_en: string;
  is_verified: boolean;
  is_featured: boolean;
  images: BackendImage[];
};

export type PropertySearchFilters = {
  listingType?: ListingType;
  q?: string;
  project?: string;
  propertyType?: Property["propertyType"] | "";
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  minPrice?: number;
  maxPrice?: number;
  furnitureStatus?: string;
  viewType?: string;
  verifiedOnly?: boolean;
  petFriendly?: boolean;
  balcony?: boolean;
  parking?: boolean;
};

async function safeJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiBase}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json() as Promise<T>;
  } catch {
    return null;
  }
}

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  return Number(value);
}

function formatAvailableFrom(value: string | null | undefined) {
  if (!value) return "Available now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function numericParam(value: string | string[] | undefined) {
  const raw = firstValue(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function booleanParam(value: string | string[] | undefined) {
  const raw = firstValue(value);
  if (!raw) return undefined;
  return raw === "true" || raw === "1" || raw === "on";
}

function cleanParam(value: string | string[] | undefined) {
  return firstValue(value)?.trim() || undefined;
}

function priceToVnd(value: number | undefined, listingType?: ListingType) {
  if (!value) return undefined;
  if (value >= 1_000_000) return value;
  return value * (listingType === "sale" ? 1_000_000_000 : 1_000_000);
}

function displayPriceToVnd(value: number | undefined, listingType?: ListingType) {
  return priceToVnd(value, listingType);
}

export function filtersFromSearchParams(
  listingType: ListingType,
  searchParams: Record<string, string | string[] | undefined>
): PropertySearchFilters {
  return {
    listingType,
    q: cleanParam(searchParams.q),
    project: cleanParam(searchParams.project),
    propertyType: cleanParam(searchParams.property_type) as PropertySearchFilters["propertyType"],
    bedrooms: numericParam(searchParams.bedrooms),
    bathrooms: numericParam(searchParams.bathrooms),
    minArea: numericParam(searchParams.min_area),
    maxArea: numericParam(searchParams.max_area),
    minPrice: numericParam(searchParams.min_price),
    maxPrice: numericParam(searchParams.max_price),
    furnitureStatus: cleanParam(searchParams.furniture_status),
    viewType: cleanParam(searchParams.view_type),
    verifiedOnly: booleanParam(searchParams.verified_only) ?? true,
    petFriendly: booleanParam(searchParams.pet_friendly),
    balcony: booleanParam(searchParams.balcony),
    parking: booleanParam(searchParams.parking)
  };
}

function mapProject(project: BackendProject): Project {
  return {
    id: project.id,
    name: project.name,
    slug: project.slug,
    description: project.description,
    address: project.address,
    propertyTypes: project.property_types,
    amenities: project.amenities,
    nearbyPlaces: project.nearby_places,
    imageUrl: project.images[0] ?? fallbackProjects[0].imageUrl
  };
}

function mapProperty(property: BackendProperty, projects: Project[]): Property {
  const project = projects.find((item) => item.id === property.project_id);
  const cover = property.images.find((image) => image.is_cover) ?? property.images[0];
  return {
    id: property.id,
    code: property.code,
    slug: property.slug,
    title: property.title,
    listingType: property.listing_type,
    propertyType: property.property_type,
    status: property.status,
    project: project?.name ?? "Phu My Hung",
    projectSlug: project?.slug ?? "phu-my-hung",
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    areaSqm: Number(property.area_sqm),
    rentalPrice: toNumber(property.rental_price),
    salePrice: toNumber(property.sale_price),
    currency: property.currency,
    furnitureStatus: property.furniture_status,
    viewType: property.view_type ?? "city",
    balcony: property.balcony,
    petFriendly: property.pet_friendly,
    parking: property.parking,
    availableFrom: formatAvailableFrom(property.available_from),
    isVerified: property.is_verified,
    isFeatured: property.is_featured,
    imageUrl: cover?.image_url ?? fallbackProperties[0].imageUrl,
    description: property.description_en,
    nearby: project?.nearbyPlaces ?? ["Crescent Mall", "Starlight Bridge", "Phu My Hung parks"]
  };
}

export async function getProjects(): Promise<Project[]> {
  const data = await safeJson<BackendProject[]>("/public/projects");
  return data?.length ? data.map(mapProject) : fallbackProjects;
}

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

function buildPropertyQuery(filters: PropertySearchFilters, projects: Project[]) {
  const params = new URLSearchParams();
  if (filters.listingType) params.set("listing_type", filters.listingType);
  if (filters.q) params.set("q", filters.q);
  if (filters.propertyType) params.set("property_type", filters.propertyType);
  if (filters.project) {
    const project = projects.find((item) => item.slug === filters.project || item.name === filters.project);
    if (project) params.set("project_id", String(project.id));
  }
  if (filters.bedrooms) params.set("bedrooms", String(filters.bedrooms));
  if (filters.bathrooms) params.set("bathrooms", String(filters.bathrooms));
  if (filters.minArea) params.set("min_area", String(filters.minArea));
  if (filters.maxArea) params.set("max_area", String(filters.maxArea));
  if (filters.minPrice) params.set("min_price", String(displayPriceToVnd(filters.minPrice, filters.listingType)));
  if (filters.maxPrice) params.set("max_price", String(displayPriceToVnd(filters.maxPrice, filters.listingType)));
  if (filters.furnitureStatus) params.set("furniture_status", filters.furnitureStatus);
  if (filters.viewType) params.set("view_type", filters.viewType);
  if (filters.verifiedOnly !== undefined) params.set("verified_only", String(filters.verifiedOnly));
  if (filters.petFriendly !== undefined) params.set("pet_friendly", String(filters.petFriendly));
  if (filters.balcony !== undefined) params.set("balcony", String(filters.balcony));
  if (filters.parking !== undefined) params.set("parking", String(filters.parking));
  const query = params.toString();
  return query ? `?${query}` : "";
}

function filterFallbackProperties(filters: PropertySearchFilters) {
  const minPrice = priceToVnd(filters.minPrice, filters.listingType);
  const maxPrice = priceToVnd(filters.maxPrice, filters.listingType);
  const text = filters.q?.toLowerCase();
  return fallbackProperties.filter((property) => {
    const activePrice = property.listingType === "sale" ? property.salePrice : property.rentalPrice;
    return (!filters.listingType || property.listingType === filters.listingType)
      && (!filters.project || property.projectSlug === filters.project)
      && (!filters.propertyType || property.propertyType === filters.propertyType)
      && (!filters.bedrooms || property.bedrooms >= filters.bedrooms)
      && (!filters.bathrooms || property.bathrooms >= filters.bathrooms)
      && (!filters.minArea || property.areaSqm >= filters.minArea)
      && (!filters.maxArea || property.areaSqm <= filters.maxArea)
      && (!minPrice || Number(activePrice) >= minPrice)
      && (!maxPrice || Number(activePrice) <= maxPrice)
      && (!filters.furnitureStatus || property.furnitureStatus === filters.furnitureStatus)
      && (!filters.viewType || property.viewType === filters.viewType)
      && (filters.verifiedOnly === false || property.isVerified)
      && (filters.petFriendly === undefined || property.petFriendly === filters.petFriendly)
      && (filters.balcony === undefined || property.balcony === filters.balcony)
      && (filters.parking === undefined || property.parking === filters.parking)
      && (!text || [property.code, property.title, property.project].some((value) => value.toLowerCase().includes(text)));
  });
}

export async function getProperties(filtersOrListingType: ListingType | PropertySearchFilters = {}): Promise<Property[]> {
  const filters = typeof filtersOrListingType === "string" ? { listingType: filtersOrListingType } : filtersOrListingType;
  const projectList = await getProjects();
  const query = buildPropertyQuery(filters, projectList);
  const data = await safeJson<BackendProperty[]>(`/public/properties${query}`);
  if (data === null) {
    return filterFallbackProperties(filters);
  }
  return data.map((property) => mapProperty(property, projectList));
}

export async function getProperty(slug: string): Promise<Property | null> {
  const [projectList, data] = await Promise.all([getProjects(), safeJson<BackendProperty>(`/public/properties/${slug}`)]);
  if (!data) return fallbackProperties.find((property) => property.slug === slug) ?? null;
  return mapProperty(data, projectList);
}
