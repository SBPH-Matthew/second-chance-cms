import { Modal } from "@carbon/react";

interface DeleteProductModalProps {
    open: boolean;
    productName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteProductModal = ({
    open,
    productName,
    onClose,
    onConfirm,
}: DeleteProductModalProps) => {
    return (
        <Modal
            open={open}
            onRequestClose={onClose}
            onRequestSubmit={() => {
                onConfirm();
                onClose();
            }}
            modalHeading="Delete Product"
            primaryButtonText="Delete"
            secondaryButtonText="Cancel"
            danger
        >
            <p style={{ marginBottom: "1rem" }}>
                Are you sure you want to delete the product <strong>{productName}</strong>? This action cannot be undone.
            </p>
        </Modal>
    );
};
