import { GetProductStatusesResponse, ValidationResponse } from "@/app/types";

export const getProductStatuses = async (
    signal?: AbortSignal
): Promise<GetProductStatusesResponse> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/product-status/`,
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

export interface CreateProductStatusRequest {
  name: string;
}

export interface CreateProductStatusResponse {
  message: string;
  product_status?: {
    id: number;
    name: string;
  };
}

export interface UpdateProductStatusResponse {
  message: string;
  product_status?: {
    id: number;
    name: string;
  };
}

export const createProductStatus = async (
  payload: CreateProductStatusRequest,
): Promise<CreateProductStatusResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/product-status/`,
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

export const updateProductStatus = async ({
  id,
  payload,
}: {
  id: number;
  payload: CreateProductStatusRequest;
}): Promise<UpdateProductStatusResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/product-status/${id}`,
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

export const deleteProductStatus = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/product-status/${id}`,
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
