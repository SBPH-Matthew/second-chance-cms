import { ResponseType } from "./ResponseType";
import { User } from "./shared";
import { Product } from "./product";

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    is_read: boolean;
    created_at: string;
    updated_at: string;
}

export interface Conversation {
    id: number;
    participant_one_id: number;
    participant_two_id: number;
    product_id?: number;
    product?: Product;
    messages?: Message[];
    created_at: string;
    updated_at: string;
}

export interface SendMessageRequest {
    recipient_id: number;
    product_id?: number;
    content: string;
}

export type SendMessageResponse = Message;

export type GetConversationsResponse = Conversation[];
export type GetMessagesResponse = Message[];
