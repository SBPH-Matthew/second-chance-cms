import {
  GetNotificationsResponse,
} from "@/app/types/notification";
import { ResponseType } from "@/app/types/ResponseType";

export const getNotifications = async (
  signal?: AbortSignal,
): Promise<GetNotificationsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/notification/`,
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

export const markNotificationAsRead = async (
  id: number,
): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/notification/${id}/read`,
    {
      method: "PUT",
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

export const markAllNotificationsAsRead = async (): Promise<ResponseType> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/notification/read-all`,
    {
      method: "PUT",
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
