import { VehicleTypeResponse } from "@/app/types/vehicle";
import { ValidationResponse } from "@/app/types/ResponseType";

export const getVehicleTypes = async (
  signal?: AbortSignal
): Promise<VehicleTypeResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/vehicle-type/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export interface CreateVehicleTypeRequest {
  name: string;
}

export interface CreateVehicleTypeResponse {
  message: string;
  vehicle_type?: {
    id: number;
    name: string;
  };
}

export interface UpdateVehicleTypeResponse {
  message: string;
  vehicle_type?: {
    id: number;
    name: string;
  };
}

export const createVehicleType = async (
  payload: CreateVehicleTypeRequest,
): Promise<CreateVehicleTypeResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/vehicle-type/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const updateVehicleType = async ({
  id,
  payload,
}: {
  id: number;
  payload: CreateVehicleTypeRequest;
}): Promise<UpdateVehicleTypeResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/vehicle-type/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const deleteVehicleType = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/vehicle-type/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
