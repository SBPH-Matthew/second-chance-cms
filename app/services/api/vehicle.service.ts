import {
  CreateVehicleRequest,
  VehiclePaginateResponse,
  VehicleTypeResponse,
  ResponseType,
} from "@/app/types/vehicle";

export interface PaginateVehiclesParams {
  page: number;
  limit: number;
  signal?: AbortSignal;
}

export const paginateVehicles = async ({
  page,
  limit,
  signal,
}: PaginateVehiclesParams): Promise<VehiclePaginateResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/vehicle/?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      signal,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const createVehicle = async (
  payload: CreateVehicleRequest,
): Promise<ResponseType> => {
  // Check if there are images to upload
  const hasImages = payload.images && payload.images.length > 0;

  let body: FormData | string;
  let headers: HeadersInit;

  if (hasImages) {
    // Use FormData for multipart/form-data
    const formData = new FormData();
    formData.append("vehicleMake", payload.vehicleMake);
    formData.append("vehicleModel", payload.vehicleModel);
    formData.append("year", payload.year.toString());
    formData.append("price", payload.price.toString());
    if (payload.description) {
      formData.append("description", payload.description);
    }
    if (payload.location) {
      formData.append("location", payload.location);
    }
    formData.append("vehicleType", payload.vehicleType.toString());

    // Append all image files
    payload.images!.forEach((file) => {
      formData.append("images", file);
    });

    body = formData;
    // Don't set Content-Type header, let browser set it with boundary
    headers = {};
  } else {
    // Use JSON for regular requests
    body = JSON.stringify(payload);
    headers = {
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/vehicle/`, {
    method: "POST",
    headers,
    credentials: "include",
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const updateVehicle = async ({
  id,
  payload,
  initialData,
}: {
  id: number;
  payload: CreateVehicleRequest;
  initialData?: any;
}): Promise<ResponseType> => {
  // Check if there are images to upload or existing images to manage
  const hasImages = payload.images && payload.images.length > 0;
  const hasExistingImages = payload.existingImages !== undefined;

  let body: FormData | string;
  let headers: HeadersInit;

  if (hasImages || hasExistingImages) {
    // Use FormData for multipart/form-data when managing images
    const formData = new FormData();
    formData.append("vehicleMake", payload.vehicleMake);
    formData.append("vehicleModel", payload.vehicleModel);
    formData.append("year", payload.year.toString());
    formData.append("price", payload.price.toString());
    if (payload.description) {
      formData.append("description", payload.description);
    }
    if (payload.location) {
      formData.append("location", payload.location);
    }
    formData.append("vehicleType", payload.vehicleType.toString());

    // Always append existingImages (even if empty array) to indicate image management
    if (initialData) {
      formData.append("existingImages", JSON.stringify(payload.existingImages || []));
    }

    // Append all new image files
    if (hasImages) {
      payload.images!.forEach((file) => {
        formData.append("images", file);
      });
    }

    body = formData;
    // Don't set Content-Type header, let browser set it with boundary
    headers = {};
  } else {
    // Use JSON for regular requests without image management
    body = JSON.stringify(payload);
    headers = {
      "Content-Type": "application/json",
    };
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/vehicle/${id}`, {
    method: "PUT",
    headers,
    credentials: "include",
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const deleteVehicle = async (id: number): Promise<ResponseType> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/vehicle/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const getAllVehicleTypes = async (): Promise<VehicleTypeResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/vehicle-type/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
