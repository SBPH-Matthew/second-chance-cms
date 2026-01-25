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
  // Always use FormData since backend expects multipart/form-data
  const formData = new FormData();
  formData.append("first_name", payload.first_name);
  formData.append("last_name", payload.last_name);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("confirm_password", payload.confirm_password);
  formData.append("role", payload.role);

  if (payload.profile_picture) {
    formData.append("profile_picture", payload.profile_picture);
  }
  if (payload.country) {
    formData.append("country", payload.country);
  }
  if (payload.state_province) {
    formData.append("state_province", payload.state_province);
  }
  if (payload.street_address_1) {
    formData.append("street_address_1", payload.street_address_1);
  }
  if (payload.street_address_2) {
    formData.append("street_address_2", payload.street_address_2);
  }
  if (payload.zip_postal_code) {
    formData.append("zip_postal_code", payload.zip_postal_code);
  }
  if (payload.rating !== undefined) {
    formData.append("rating", String(payload.rating));
  }
  if (payload.total_reviews !== undefined) {
    formData.append("total_reviews", String(payload.total_reviews));
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/`, {
    method: "POST",
    // Don't set Content-Type header, let browser set it with boundary
    credentials: "include",
    body: formData,
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
  // Always use FormData since backend expects multipart/form-data
  const formData = new FormData();
  formData.append("first_name", payload.first_name);
  formData.append("last_name", payload.last_name);
  formData.append("email", payload.email);
  formData.append("role", payload.role);

  if (payload.profile_picture) {
    formData.append("profile_picture", payload.profile_picture);
  }
  if (payload.existing_profile_picture) {
    formData.append("existing_profile_picture", payload.existing_profile_picture);
  }
  if (payload.country) {
    formData.append("country", payload.country);
  }
  if (payload.state_province) {
    formData.append("state_province", payload.state_province);
  }
  if (payload.street_address_1) {
    formData.append("street_address_1", payload.street_address_1);
  }
  if (payload.street_address_2) {
    formData.append("street_address_2", payload.street_address_2);
  }
  if (payload.zip_postal_code) {
    formData.append("zip_postal_code", payload.zip_postal_code);
  }
  if (payload.rating !== undefined) {
    formData.append("rating", String(payload.rating));
  }
  if (payload.total_reviews !== undefined) {
    formData.append("total_reviews", String(payload.total_reviews));
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/${id}`, {
    method: "PUT",
    // Don't set Content-Type header, let browser set it with boundary
    credentials: "include",
    body: formData,
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
