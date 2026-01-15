import { GetProductConditionsResponse, ValidationResponse } from "@/app/types";

export const getProductConditions = async (
    signal?: AbortSignal
): Promise<GetProductConditionsResponse> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/product-condition/`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            signal,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
};

export interface CreateProductConditionRequest {
  name: string;
}

export interface CreateProductConditionResponse {
  message: string;
  product_condition: {
    id: number;
    name: string;
  };
}

export interface UpdateProductConditionResponse {
  message: string;
  product_condition: {
    id: number;
    name: string;
  };
}

export const createProductCondition = async (
  payload: CreateProductConditionRequest,
): Promise<CreateProductConditionResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/product-condition/`,
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

export const updateProductCondition = async ({
  id,
  payload,
}: {
  id: number;
  payload: CreateProductConditionRequest;
}): Promise<UpdateProductConditionResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/product-condition/${id}`,
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

export const deleteProductCondition = async (id: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API}/product-condition/${id}`,
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
