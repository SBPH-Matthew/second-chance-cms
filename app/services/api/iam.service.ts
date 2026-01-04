import {
    CreateUserSchema,
    PaginateUsersResponse,
    UpdateUserSchema,
} from "@/app/types";

export interface PaginateUserParams {
    page: number;
    limit: number;
    signal?: AbortSignal;
}

export const paginateUser = async ({
    page,
    limit,
    signal,
}: PaginateUserParams): Promise<PaginateUsersResponse> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/user/?page=${page}&limit=${limit}`,
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

export const createUser = async (payload: CreateUserSchema) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/`, {
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

export const updateUser = async ({
    id,
    payload,
}: {
    id: number;
    payload: UpdateUserSchema;
}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/${id}`, {
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
