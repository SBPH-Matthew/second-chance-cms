import {
  CategoryPaginationResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  GetCategoryGroupsResponse,
  GetCategoryStatusesResponse,
  ServerValidationErrors,
} from "@/app/types";

export const getCategoryGroups =
  async (): Promise<GetCategoryGroupsResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/category-group/`,
      {
        method: "GET",
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

export const getCategoryStatuses =
  async (): Promise<GetCategoryStatusesResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/category-status/`,
      {
        method: "GET",
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

export const createCategory = async (
  payload: CreateCategoryRequest,
): Promise<CreateCategoryResponse | ServerValidationErrors> => {
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
    throw data as ServerValidationErrors;
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
    throw data as ServerValidationErrors;
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
