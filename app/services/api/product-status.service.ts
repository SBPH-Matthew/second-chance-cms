import { GetProductStatusesResponse } from "@/app/types";

export const getProductStatuses = async (
    signal?: AbortSignal
): Promise<GetProductStatusesResponse> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/product-status/`,
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
