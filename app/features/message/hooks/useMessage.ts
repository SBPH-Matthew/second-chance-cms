import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getAllConversations,
    getConversations,
    getMessagesByConversationId,
    sendMessage,
} from "@/app/services";
import { SendMessageRequest } from "@/app/types";

export const useGetAllConversations = () => {
    return useQuery({
        queryKey: ["all-conversations"],
        queryFn: getAllConversations,
    });
};

export const useGetConversations = () => {
    return useQuery({
        queryKey: ["conversations"],
        queryFn: getConversations,
    });
};

export const useGetMessages = (conversationId: number) => {
    return useQuery({
        queryKey: ["messages", conversationId],
        queryFn: () => getMessagesByConversationId(conversationId),
        enabled: !!conversationId,
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: SendMessageRequest) => sendMessage(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["conversations"] });
            queryClient.invalidateQueries({ queryKey: ["messages"] });
        },
    });
};
