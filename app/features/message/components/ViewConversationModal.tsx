import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@carbon/react";
import { Conversation, Message } from "@/app/types";

interface ViewConversationModalProps {
    open: boolean;
    onClose: () => void;
    conversation: Conversation | null;
}

export const ViewConversationModal = ({
    open,
    onClose,
    conversation,
}: ViewConversationModalProps) => {
    if (!conversation) return null;

    return (
        <ComposedModal open={open} onClose={onClose} size="md">
            <ModalHeader
                title={`Conversation #${conversation.id}`}
                label={conversation.product ? `Product: ${conversation.product.name}` : "General Conversation"}
                closeModal={onClose}
            />
            <ModalBody>
                <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto p-2">
                    {conversation.messages?.map((msg: Message) => {
                        const isP1 = msg.sender_id === conversation.participant_one_id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col max-w-[80%] ${isP1 ? "self-start items-start" : "self-end items-end"
                                    }`}
                            >
                                <div
                                    className={`p-3 rounded-lg ${isP1
                                            ? "bg-gray-100 text-gray-800"
                                            : "bg-blue-600 text-white"
                                        }`}
                                >
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                                <span className="text-[10px] text-gray-400 mt-1">
                                    Sender: {msg.sender_id} • {new Date(msg.created_at).toLocaleString()}
                                </span>
                            </div>
                        );
                    })}
                    {(!conversation.messages || conversation.messages.length === 0) && (
                        <p className="text-center text-gray-500 py-4">No messages in this conversation.</p>
                    )}
                </div>
            </ModalBody>
            <ModalFooter>
                <Button kind="secondary" onClick={onClose}>
                    Close
                </Button>
            </ModalFooter>
        </ComposedModal>
    );
};
