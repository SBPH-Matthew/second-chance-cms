import {
    GetConversationsResponse,
    GetMessagesResponse,
    SendMessageRequest,
    SendMessageResponse,
} from "@/app/types";

export const getConversations = async (): Promise<GetConversationsResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/message/conversations`, {
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

export const getAllConversations = async (): Promise<GetConversationsResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/message/all`, {
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

export const getMessagesByConversationId = async (
    id: number
): Promise<GetMessagesResponse> => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/message/conversation/${id}`,
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

export const sendMessage = async (
    payload: SendMessageRequest
): Promise<SendMessageResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/message/send`, {
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
