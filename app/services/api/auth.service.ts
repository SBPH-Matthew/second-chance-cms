import { RegisterRequestType, RegisterResponseType } from "@/app/types";

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

    if (!response.ok) {
        throw new Error("Failed to register user.");
    }

    return response.json();
};
