import { ResponseType } from "../ResponseType";

// Backend model types (snake_case from JSON tags)
export interface Category {
  id: number;
  name: string;
  status_id: number;
  category_group_id: number;
  status?: CategoryStatus;
  category_group?: CategoryGroup;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CategoryGroup {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface CategoryStatus {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Response types
export interface GetCategoryGroupsResponse extends ResponseType {
  category_groups: CategoryGroup[];
}

export interface GetCategoryStatusesResponse extends ResponseType {
  category_statuses: CategoryStatus[];
}

export interface CategoryPaginationResponse extends ResponseType {
  categories: {
    total: number;
    items: Category[];
  };
}

export interface GetAllCategoriesResponse extends ResponseType {
  categories: Category[];
}
