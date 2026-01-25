import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    TextInput,
    TextArea,
    Button,
} from "@carbon/react";
import { useState } from "react";
import { useSendMessage } from "../hooks/useMessage";
import { User } from "@/app/types";

interface SendMessageModalProps {
    open: boolean;
    onClose: () => void;
    recipient: User | null;
}

export const SendMessageModal = ({
    open,
    onClose,
    recipient,
}: SendMessageModalProps) => {
    const [content, setContent] = useState("");
    const { mutate: sendMessage, isPending } = useSendMessage();

    const handleSend = () => {
        if (!recipient || !content.trim()) return;

        sendMessage(
            {
                recipient_id: recipient.id,
                content: content.trim(),
            },
            {
                onSuccess: () => {
                    setContent("");
                    onClose();
                },
            }
        );
    };

    return (
        <ComposedModal open={open} onClose={onClose} size="sm">
            <ModalHeader
                title={`Message to ${recipient?.first_name} ${recipient?.last_name}`}
                label="Communication"
                closeModal={onClose}
            />
            <ModalBody>
                <p className="text-sm mb-4">
                    Send a direct message to this user.
                </p>
                <TextArea
                    id="message-content"
                    labelText="Message"
                    placeholder="Type your message here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                />
            </ModalBody>
            <ModalFooter>
                <Button kind="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={handleSend} disabled={isPending || !content.trim()}>
                    {isPending ? "Sending..." : "Send Message"}
                </Button>
            </ModalFooter>
        </ComposedModal>
    );
};
