import { z } from "zod";
import { ResponseType } from "../ResponseType";
import { Category } from "../category";
import { User } from "../shared";

// Backend model types (snake_case from JSON tags)
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  category_id: number;
  status_id: number;
  seller_id: number;
  product_condition_id: number;
  category?: Category;
  status?: ProductStatus;
  seller?: User;
  product_condition?: ProductCondition;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ProductStatus {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ProductCondition {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Zod Schemas
export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  status: z.string().min(1, "Status is required"),
  images: z.array(z.instanceof(File)).optional(),
  existingImages: z.array(z.string()).optional(),
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;

// API Responses
export interface ProductPaginationResponse extends ResponseType {
  products: {
    total: number;
    items: Product[];
  };
}

export interface GetProductConditionsResponse extends ResponseType {
  product_conditions: ProductCondition[];
}

export interface GetProductStatusesResponse extends ResponseType {
  product_status: ProductStatus[];
}
