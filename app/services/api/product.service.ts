import {
    CreateProductRequest,
    CreateProductResponse,
    ProductDetailsResponse,
    ProductPaginationResponse,
    ResponseType,
} from "@/app/types";

export interface PaginateProductsParams {
    page: number;
    limit: number;
    signal?: AbortSignal;
}

export const paginateProducts = async ({
    page,
    limit,
    signal,
}: PaginateProductsParams): Promise<ProductPaginationResponse> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/product/?page=${page}&limit=${limit}`,
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

export const paginateMyProducts = async ({
    page,
    limit,
    signal,
}: PaginateProductsParams): Promise<ProductPaginationResponse> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/product/self?page=${page}&limit=${limit}`,
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

export const createProduct = async (
    payload: CreateProductRequest
): Promise<CreateProductResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/product/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
};

export const updateProduct = async ({
    id,
    payload,
}: {
    id: number;
    payload: CreateProductRequest;
}): Promise<ResponseType> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/product/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
};

export const deleteProduct = async (id: number): Promise<ResponseType> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/product/${id}`,
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
};

export const getProductDetails = async (
    id: number
): Promise<ProductDetailsResponse> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/product/${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
};
