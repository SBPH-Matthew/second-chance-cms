import { z } from "zod";
import { ResponseType } from "../ResponseType";
import { User } from "../shared";
import { Boost } from "../boost";

// Backend model types (snake_case from JSON tags)
export interface Vehicle {
  id: number;
  vehicle_type_id?: number | null;
  location: string;
  year: number;
  vehicle_make: string;
  vehicle_model: string;
  price: number;
  description: string;
  images: string[];
  seller_id: number;
  vehicle_type?: VehicleType;
  seller?: User;
  active_boost?: Boost;
  is_boosted?: boolean;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface VehicleType {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

// Request types (camelCase for frontend forms)
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

// Response types
export interface VehiclePaginateResponse extends ResponseType {
  vehicles: {
    total: number;
    items: Vehicle[];
  };
}

export interface VehicleTypeResponse extends ResponseType {
  vehicleTypes: {
    total: number;
    items: VehicleType[];
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
