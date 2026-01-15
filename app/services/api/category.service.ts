import {
  CategoryPaginationResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetAllCategoriesResponse,
  GetCategoryGroupsResponse,
  GetCategoryStatusesResponse,
  SetCategoryStatusRequest,
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
): Promise<CreateCategoryResponse> => {
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
}) => {
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
  signal?: AbortSignal;
}

export const paginateCategories = async ({
  page,
  limit,
  signal,
}: PaginateCategoriesParams): Promise<CategoryPaginationResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/category/?page=${page}&limit=${limit}`,
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

export const deleteCategory = async (id: number) => {
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
}: SetCategoryStatusRequest) => {
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

export interface CreateCategoryGroupResponse {
  message: string;
  category_group: {
    id: number;
    name: string;
  };
}

export interface UpdateCategoryGroupResponse {
  message: string;
  category_group: {
    id: number;
    name: string;
  };
}

export const createCategoryGroup = async (
  payload: CreateCategoryGroupRequest,
): Promise<CreateCategoryGroupResponse> => {
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
}): Promise<UpdateCategoryGroupResponse> => {
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

export interface CreateCategoryStatusResponse {
  message: string;
  category_status: {
    id: number;
    name: string;
  };
}

export interface UpdateCategoryStatusResponse {
  message: string;
  category_status: {
    id: number;
    name: string;
  };
}

export const createCategoryStatus = async (
  payload: CreateCategoryStatusRequest,
): Promise<CreateCategoryStatusResponse> => {
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
}): Promise<UpdateCategoryStatusResponse> => {
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

export const deleteCategoryStatus = async (id: number) => {
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
