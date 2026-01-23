import { User } from "@/app/types";
import { ResponseType } from "@/app/types/ResponseType";

export interface ProfileResponse extends ResponseType {
  user: User;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/me`, {
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
