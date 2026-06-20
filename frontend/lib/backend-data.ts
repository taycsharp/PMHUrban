import { projects as fallbackProjects, properties as fallbackProperties } from "@/lib/sample-data";
import { Project, Property } from "@/types";

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
    availableFrom: property.available_from ?? "Available now",
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

export async function getProperties(listingType?: "rent" | "sale"): Promise<Property[]> {
  const query = listingType ? `?listing_type=${listingType}` : "";
  const [projectList, data] = await Promise.all([getProjects(), safeJson<BackendProperty[]>(`/public/properties${query}`)]);
  if (!data?.length) {
    return fallbackProperties.filter((property) => !listingType || property.listingType === listingType);
  }
  return data.map((property) => mapProperty(property, projectList));
}

export async function getProperty(slug: string): Promise<Property | null> {
  const [projectList, data] = await Promise.all([getProjects(), safeJson<BackendProperty>(`/public/properties/${slug}`)]);
  if (!data) return fallbackProperties.find((property) => property.slug === slug) ?? null;
  return mapProperty(data, projectList);
}

