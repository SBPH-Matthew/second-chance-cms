import {
  Boost,
  CreateBoostRequest,
  UpdateBoostRequest,
  BoostPricing,
} from "@/app/types";

export const getBoostPricing = async (): Promise<BoostPricing> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/boost/pricing`);
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data.pricing;
};

export const createBoost = async (
  data: CreateBoostRequest,
): Promise<Boost> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/boost/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw result;
  }
  return result;
};

export const getUserBoosts = async (): Promise<Boost[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/boost/`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data.boosts;
};

export const getBoost = async (id: number): Promise<Boost> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/boost/${id}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
};

export const updateBoost = async (
  id: number,
  data: UpdateBoostRequest,
): Promise<Boost> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/boost/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw result;
  }
  return result;
};

export const cancelBoost = async (id: number): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/boost/${id}/cancel`, {
    method: "PUT",
    credentials: "include",
  });
  if (!response.ok) {
    const data = await response.json();
    throw data;
  }
};