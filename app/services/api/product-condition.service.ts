import { GetProductConditionsResponse } from "@/app/types";

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
