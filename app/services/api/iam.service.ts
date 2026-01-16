import {
  CreateUserSchema,
  PaginateUsersResponse,
  UpdateUserPasswordSchema,
  UpdateUserSchema,
  ResponseType,
} from "@/app/types";

export interface PaginateUserParams {
  page: number;
  limit: number;
  signal?: AbortSignal;
}

export const paginateUser = async ({
  page,
  limit,
  signal,
}: PaginateUserParams): Promise<PaginateUsersResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/user/?page=${page}&limit=${limit}`,
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

export const createUser = async (payload: CreateUserSchema): Promise<ResponseType> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/`, {
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

export const updateUser = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateUserSchema;
}): Promise<ResponseType> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/${id}`, {
    method: "PUT",
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

export const changePassword = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateUserPasswordSchema;
}): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/user/${id}/password`,
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

export const deleteUser = async (id: number): Promise<ResponseType> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/${id}`, {
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
