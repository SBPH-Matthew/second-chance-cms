import {
  CreateProductRequest,
  ProductPaginationResponse,
  ResponseType,
  Product,
} from "@/app/types";

export interface PaginateProductsParams {
  page: number;
  limit: number;
  search?: string;
  signal?: AbortSignal;
}

export const paginateProducts = async ({
  page,
  limit,
  search,
  signal,
}: PaginateProductsParams): Promise<ProductPaginationResponse> => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/product/?page=${page}&limit=${limit}${searchParam}`,
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

export const paginateMyProducts = async ({
  page,
  limit,
  signal,
}: PaginateProductsParams): Promise<ProductPaginationResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/product/self?page=${page}&limit=${limit}`,
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

export const createProduct = async (
  payload: CreateProductRequest,
): Promise<ResponseType> => {
  // Check if there are images to upload
  const hasImages = payload.images && payload.images.length > 0;

  let body: FormData | string;
  let headers: HeadersInit;

  if (hasImages) {
    // Use FormData for multipart/form-data
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("price", payload.price.toString());
    formData.append("category", payload.category);
    formData.append("condition", payload.condition);
    formData.append("status", payload.status);

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/product/`, {
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

export const updateProduct = async ({
  id,
  payload,
}: {
  id: number;
  payload: CreateProductRequest;
}): Promise<ResponseType> => {
  // Check if there are images to upload or existing images to manage
  const hasImages = payload.images && payload.images.length > 0;
  const hasExistingImages = payload.existingImages !== undefined;

  let body: FormData | string;
  let headers: HeadersInit;

  if (hasImages || hasExistingImages) {
    // Use FormData for multipart/form-data when managing images
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("description", payload.description);
    formData.append("price", payload.price.toString());
    formData.append("category", payload.category);
    formData.append("condition", payload.condition);
    formData.append("status", payload.status);

    // Always append existingImages (even if empty array) to indicate image management
    formData.append("existingImages", JSON.stringify(payload.existingImages || []));

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

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/product/${id}`, {
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

export const deleteProduct = async (id: number): Promise<ResponseType> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/product/${id}`, {
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

export const getProductDetails = async (
  id: number,
): Promise<{ message: string; product: Product }> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/product/${id}`, {
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
