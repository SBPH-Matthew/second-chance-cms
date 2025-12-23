import {
  LoginRequestType,
  LoginResponseType,
  RegisterRequestType,
  RegisterResponseType,
} from "@/app/types";

export const register = async (
  payload: RegisterRequestType,
): Promise<RegisterResponseType> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/register`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 409) {
      throw {
        status: response.status,
        ...data,
      };
    }

    throw data;
  }

  return data;
};

export const login = async (
  payload: LoginRequestType,
): Promise<LoginResponseType> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API}/login`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      ...data,
    };
  }

  return data;
};
