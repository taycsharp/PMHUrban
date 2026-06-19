export type ListingType = "rent" | "sale";

export type Property = {
  id: number;
  code: string;
  slug: string;
  title: string;
  listingType: ListingType;
  propertyType: "apartment" | "villa" | "townhouse" | "shophouse" | "office";
  status: string;
  project: string;
  projectSlug: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  rentalPrice?: number;
  salePrice?: number;
  currency: "VND" | "USD";
  furnitureStatus: string;
  viewType: string;
  balcony: boolean;
  petFriendly: boolean;
  parking: boolean;
  availableFrom: string;
  isVerified: boolean;
  isFeatured: boolean;
  imageUrl: string;
  description: string;
  nearby: string[];
};

export type Project = {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  propertyTypes: string[];
  amenities: string[];
  nearbyPlaces: string[];
  imageUrl: string;
};

export type Customer = {
  id: number;
  name: string;
  phone: string;
  type: string;
  status: string;
  requirement: string;
  assigned: string;
};

export type Deal = {
  id: number;
  customer: string;
  property: string;
  stage: string;
  expectedValue: number;
  commission: number;
  assigned: string;
};

