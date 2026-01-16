// Shared types used across multiple modules
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id: number;
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
