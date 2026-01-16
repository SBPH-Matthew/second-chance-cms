import {
  CategoryPaginationResponse,
  CreateCategoryRequest,
  GetAllCategoriesResponse,
  GetCategoryGroupsResponse,
  GetCategoryStatusesResponse,
  SetCategoryStatusRequest,
  ResponseType,
} from "@/app/types";

export const getCategoryGroups = async (
  signal?: AbortSignal,
): Promise<GetCategoryGroupsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category-group/`,
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

export const getCategoryStatuses = async (
  signal?: AbortSignal,
): Promise<GetCategoryStatusesResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category-status/`,
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

export const createCategory = async (
  payload: CreateCategoryRequest,
): Promise<ResponseType> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/category/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const updateCategory = async ({
  id,
  payload,
}: {
  id: number;
  payload: CreateCategoryRequest;
}): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category/${id}`,
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

export interface PaginateCategoriesParams {
  page: number;
  limit: number;
  search?: string;
  signal?: AbortSignal;
}

export const paginateCategories = async ({
  page,
  limit,
  search,
  signal,
}: PaginateCategoriesParams): Promise<CategoryPaginationResponse> => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category/?page=${page}&limit=${limit}${searchParam}`,
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

export const getAllCategories = async (
  signal?: AbortSignal,
): Promise<GetAllCategoriesResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category/all`,
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

export const deleteCategory = async (id: number): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category/${id}`,
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

export const setCategoryStatus = async ({
  id,
  status,
}: SetCategoryStatusRequest): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category/${id}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};

// Category Group CRUD operations
export interface CreateCategoryGroupRequest {
  name: string;
}

export const createCategoryGroup = async (
  payload: CreateCategoryGroupRequest,
): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category-group/`,
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

export const updateCategoryGroup = async ({
  id,
  payload,
}: {
  id: number;
  payload: CreateCategoryGroupRequest;
}): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category-group/${id}`,
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

export const deleteCategoryGroup = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category-group/${id}`,
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

// Category Status CRUD operations
export interface CreateCategoryStatusRequest {
  name: string;
}

export const createCategoryStatus = async (
  payload: CreateCategoryStatusRequest,
): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category-status/`,
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

export const updateCategoryStatus = async ({
  id,
  payload,
}: {
  id: number;
  payload: CreateCategoryStatusRequest;
}): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category-status/${id}`,
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

export const deleteCategoryStatus = async (id: number): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category-status/${id}`,
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
