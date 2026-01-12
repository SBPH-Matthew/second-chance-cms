import { z } from "zod";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId?: number;
    statusId?: number; // Optional as it might not be in all responses
    sellerId?: number;
    productConditionId?: number;
    createdAt: string;
    updatedAt: string;

    // Relations
    category?: ProductCategory | string;
    status?: ProductStatus | string; // Can be object or string based on endpoint
    condition?: string;
    seller?: User;
    productCondition?: ProductCondition;
}

export interface ProductCategory {
    id: number;
    name: string;
}

export interface ProductStatus {
    id: number;
    name: string;
}

export interface ProductCondition {
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
    price: z.coerce.number().min(0, "Price must be positive"),
    category_id: z.coerce.number().min(1, "Category is required"),
    product_condition_id: z.coerce.number().min(1, "Condition is required"),
    status_id: z.coerce.number().min(1, "Status is required"),
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
    product_conditions: ProductCondition[];
}

export interface GetProductStatusesResponse {
    message: string;
    product_status: ProductStatus[];
}
