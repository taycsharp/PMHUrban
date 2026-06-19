import { Customer, Deal, Project, Property } from "@/types";

export const projects: Project[] = [
  "Midtown",
  "Sky Garden",
  "Scenic Valley",
  "Happy Valley",
  "Riverside Residence",
  "Green Valley",
  "Nam Phuc",
  "Panorama",
  "Star Hill",
  "Chateau",
  "Grand View",
  "Garden Court",
  "My Phu",
  "My Vien",
  "My Khang",
  "My Canh"
].map((name, index) => ({
  id: index + 1,
  name,
  slug: name.toLowerCase().replaceAll(" ", "-"),
  description: `${name} is a high-demand Phu My Hung community with verified homes, resident amenities, and strong access to District 7 lifestyle points.`,
  address: `${name}, Phu My Hung, District 7, Ho Chi Minh City`,
  propertyTypes: index % 5 === 0 ? ["apartment", "shophouse", "office"] : ["apartment"],
  amenities: ["Pool", "Gym", "Security", "Parks", "Retail"],
  nearbyPlaces: ["Crescent Mall", "Starlight Bridge", "Sakura Park", "International schools"],
  imageUrl: `https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80&sig=${index + 1}`
}));

export const properties: Property[] = Array.from({ length: 18 }, (_, index) => {
  const project = projects[index % projects.length];
  const listingType = index % 2 === 0 ? "rent" : "sale";
  const bedrooms = (index % 4) + 1;
  return {
    id: index + 1,
    code: `PMH-${String(index + 1).padStart(4, "0")}`,
    slug: `phu-my-hung-${project.slug}-${String(index + 1).padStart(4, "0")}`,
    title: `Verified ${bedrooms}-bedroom ${project.name} home in Phu My Hung`,
    listingType,
    propertyType: index % 8 === 0 ? "shophouse" : "apartment",
    status: index % 7 === 0 ? "reserved" : "available",
    project: project.name,
    projectSlug: project.slug,
    bedrooms,
    bathrooms: Math.max(1, bedrooms - 1),
    areaSqm: 62 + index * 8,
    rentalPrice: listingType === "rent" ? 22000000 + index * 1100000 : undefined,
    salePrice: listingType === "sale" ? 5200000000 + index * 280000000 : undefined,
    currency: "VND",
    furnitureStatus: ["basic", "fully_furnished", "luxury"][index % 3],
    viewType: ["river", "park", "city", "garden", "pool", "street"][index % 6],
    balcony: index % 2 === 0,
    petFriendly: index % 5 === 0,
    parking: index % 3 === 0,
    availableFrom: `2026-07-${String((index % 24) + 1).padStart(2, "0")}`,
    isVerified: index % 3 !== 0,
    isFeatured: index < 8,
    imageUrl: `https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80&sig=${index + 30}`,
    description: `A verified Phu My Hung listing at ${project.name}, prepared for practical viewings, owner confirmation, and a clear move-in or transaction timeline.`,
    nearby: project.nearbyPlaces
  };
});

export const customers: Customer[] = [
  { id: 1, name: "Hana Kim", phone: "+84 90 111 2222", type: "tenant", status: "viewing", requirement: "2BR Midtown or Scenic Valley, park view", assigned: "Broker 1" },
  { id: 2, name: "Minh Tran", phone: "+84 90 333 4444", type: "buyer", status: "qualified", requirement: "3BR Phu My Hung family home under 9B VND", assigned: "Broker 2" },
  { id: 3, name: "Sato Holdings", phone: "+84 90 555 6666", type: "company", status: "negotiating", requirement: "Serviced apartment options near Crescent", assigned: "Broker 3" }
];

export const deals: Deal[] = [
  { id: 1, customer: "Hana Kim", property: "PMH-0001 Midtown", stage: "viewing", expectedValue: 32000000, commission: 16000000, assigned: "Broker 1" },
  { id: 2, customer: "Minh Tran", property: "PMH-0002 Sky Garden", stage: "offer", expectedValue: 6500000000, commission: 65000000, assigned: "Broker 2" },
  { id: 3, customer: "Sato Holdings", property: "PMH-0005 Riverside Residence", stage: "contract", expectedValue: 48000000, commission: 24000000, assigned: "Broker 3" }
];

export function formatVnd(value?: number) {
  if (!value) return "Contact";
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B VND`;
  return `${Math.round(value / 1000000)}M VND`;
}

export function propertyPrice(property: Property) {
  return property.listingType === "rent" ? `${formatVnd(property.rentalPrice)}/mo` : formatVnd(property.salePrice);
}

