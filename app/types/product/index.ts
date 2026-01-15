import { z } from "zod";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images?: string[];
  status?: ProductStatus | null;
  condition?: ProductCondition | null;
  category?: ProductCategory | null;
}

export interface ProductCategory {
  ID?: number;
  Name?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
  StatusID?: number;
  CategoryGroupID?: number;
  Status?: any;
  CategoryGroup?: any;
}

// For nested objects in Product (from pagination response - uses capitalized)
export interface ProductStatus {
  ID?: number;
  Name?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

// For API responses (uses lowercase)
export interface ProductStatusResponse {
  id: number;
  name: string;
}

export interface ProductCondition {
  ID?: number;
  Name?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  DeletedAt?: string | null;
}

// For API responses (uses lowercase)
export interface ProductConditionResponse {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

// Zod Schemas
export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  condition: z.string().min(1, "Condition is required"),
  status: z.string().min(1, "Status is required"),
  images: z.array(z.instanceof(File)).optional(),
  existingImages: z.array(z.string()).optional(),
});

export type CreateProductRequest = z.infer<typeof CreateProductSchema>;

// API Responses
export interface ProductPaginationResponse {
  message: string;
  products: {
    total: number;
    items: Product[];
  };
}

export interface CreateProductResponse {
  message: string;
  product: Product;
}

export interface ProductDetailsResponse {
  message: string;
  product: Product;
}

export interface GetProductConditionsResponse {
  message: string;
  product_conditions: ProductConditionResponse[];
}

export interface GetProductStatusesResponse {
  message: string;
  product_status: ProductStatusResponse[];
}
