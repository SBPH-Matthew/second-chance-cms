import { RolesResponse } from "@/app/types";

export const getRoles = async (
  signal?: AbortSignal,
): Promise<RolesResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/role/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    signal,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
