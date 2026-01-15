import { z } from "zod";

export interface Vehicle {
  id: number;
  vehicleMake: string;
  vehicleModel: string;
  year: number;
  price: number;
  description: string;
  location: string;
  images?: string[];
  vehicleTypeId?: number;
  sellerId: number;
  vehicleType?: VehicleType;
  seller?: {
    id: number;
    name: string;
    email: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface VehicleType {
  id: number;
  name: string;
}

export interface VehicleTypeResponse {
  message: string;
  vehicleTypes: {
    total: number;
    items: VehicleType[];
  };
}

export interface CreateVehicleRequest {
  vehicleMake: string;
  vehicleModel: string;
  year: number;
  price: number;
  description?: string;
  location?: string;
  vehicleType: number;
  images?: File[];
  existingImages?: string[];
}

export interface VehiclePaginateResponse {
  message: string;
  vehicles: {
    total: number;
    items: Vehicle[];
  };
}

export const CreateVehicleSchema = z.object({
  vehicleMake: z.string().min(1, "Vehicle make is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  location: z.string().optional(),
  vehicleType: z.number().min(1, "Vehicle type is required"),
  images: z.array(z.instanceof(File)).optional(),
  existingImages: z.array(z.string()).optional(),
});

export type CreateVehicleFormData = z.infer<typeof CreateVehicleSchema>;
