export type ApiProject = {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  property_types: string[];
  amenities: string[];
  nearby_places: string[];
  images: string[];
  sort_order: number;
  active: boolean;
};

export type ApiPropertyImage = {
  id: number;
  image_url: string;
  caption?: string | null;
  sort_order: number;
  is_cover: boolean;
};

export type ApiProperty = {
  id: number;
  code: string;
  slug: string;
  title: string;
  listing_type: "rent" | "sale";
  property_type: "apartment" | "villa" | "townhouse" | "shophouse" | "office";
  status: "draft" | "available" | "reserved" | "rented" | "sold" | "inactive";
  project_id: number;
  owner_id?: number | null;
  assigned_user_id?: number | null;
  address_detail?: string | null;
  tower_block?: string | null;
  floor?: string | null;
  unit_number?: string | null;
  bedrooms: number;
  bathrooms: number;
  area_sqm: string | number;
  rental_price?: string | number | null;
  sale_price?: string | number | null;
  currency: "VND" | "USD";
  management_fee?: string | number | null;
  deposit_amount?: string | number | null;
  furniture_status: string;
  view_type?: string | null;
  balcony: boolean;
  pet_friendly: boolean;
  parking: boolean;
  available_from?: string | null;
  legal_status?: string | null;
  description_vi: string;
  description_en: string;
  internal_notes?: string | null;
  is_verified: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  images: ApiPropertyImage[];
};

export type ApiPropertyPayload = Omit<ApiProperty, "id" | "created_at" | "updated_at" | "images">;

export type ApiOwner = {
  id: number;
  full_name: string;
  phone: string;
  email?: string | null;
  zalo?: string | null;
  whatsapp?: string | null;
  nationality?: string | null;
  preferred_language: string;
  address?: string | null;
  bank_info?: string | null;
  notes?: string | null;
  assigned_user_id?: number | null;
  created_at: string;
};

export type ApiCustomer = {
  id: number;
  full_name: string;
  phone: string;
  email?: string | null;
  zalo?: string | null;
  whatsapp?: string | null;
  nationality?: string | null;
  preferred_language: string;
  customer_type: string;
  source: string;
  status: string;
  assigned_user_id?: number | null;
  notes?: string | null;
  created_at: string;
};

export type ApiRequirement = {
  id: number;
  customer_id: number;
  listing_type: string;
  property_type?: string | null;
  preferred_projects: number[];
  min_bedrooms?: number | null;
  max_bedrooms?: number | null;
  min_area?: string | number | null;
  max_area?: string | number | null;
  min_budget?: string | number | null;
  max_budget?: string | number | null;
  currency: "VND" | "USD";
  move_in_date?: string | null;
  furniture_required?: string | null;
  pet_friendly_required: boolean;
  balcony_required: boolean;
  parking_required: boolean;
  preferred_view?: string | null;
  lifestyle_notes?: string | null;
  priority_level: string;
};

export type ApiViewing = {
  id: number;
  customer_id: number;
  property_id: number;
  assigned_user_id?: number | null;
  scheduled_at: string;
  status: string;
  meeting_location?: string | null;
  customer_feedback?: string | null;
  broker_notes?: string | null;
  next_follow_up_at?: string | null;
};

export type ApiDeal = {
  id: number;
  customer_id: number;
  property_id: number;
  owner_id?: number | null;
  assigned_user_id?: number | null;
  deal_type: string;
  stage: string;
  expected_value?: string | number | null;
  final_value?: string | number | null;
  commission_rate: string | number;
  commission_amount?: string | number | null;
  expected_close_date?: string | null;
  closed_at?: string | null;
  lost_reason?: string | null;
  notes?: string | null;
};

export type ApiCommission = {
  id: number;
  deal_id: number;
  broker_id: number;
  gross_commission: string | number;
  company_share: string | number;
  broker_share: string | number;
  payment_status: string;
  paid_at?: string | null;
  note?: string | null;
};
