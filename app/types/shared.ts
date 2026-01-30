// Shared types used across multiple modules
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
  profile_picture?: string;
  country?: string;
  state_province?: string;
  street_address_1?: string;
  street_address_2?: string;
  zip_postal_code?: string;
  phone?: string;
  bio?: string;
  identity_verified?: boolean;
  id_document?: string;
  rating?: number;
  total_reviews?: number;
  role?: Role;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface Role {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
