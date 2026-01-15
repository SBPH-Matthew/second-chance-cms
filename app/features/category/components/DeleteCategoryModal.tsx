import { Modal } from "@carbon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteCategory } from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useEffect } from "react";

interface DeleteCategoryModalProps {
    open: boolean;
    onClose: () => void;
    id: number | null;
}

export const DeleteCategoryModal = ({
    open,
    onClose,
    id,
}: DeleteCategoryModalProps) => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: deleteCategory,
        isPending: isDeleting,
        isSuccess: successDelete,
        isError: errorDelete,
        reset: resetDelete,
    } = useDeleteCategory();

    const { status: deleteStatus } = useModalLoading({
        loading: isDeleting,
        success: successDelete,
        error: errorDelete,
    });

    useEffect(() => {
        if (!open) {
            resetDelete();
        }
    }, [open, resetDelete]);

    const handleDelete = () => {
        if (id) {
            deleteCategory(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["paginate-categories"],
                    });
                    queryClient.invalidateQueries({
                        queryKey: ["all-categories"],
                    });
                    setTimeout(() => {
                        onClose();
                    }, 500);
                },
                onError: (error) => {
                    console.error("Error deleting category:", error);
                },
            });
        }
    };

    return (
        <Modal
            open={open}
            aria-label="Delete category"
            modalLabel="Category resources"
            modalHeading="Are you sure you want to delete this category?"
            danger
            primaryButtonText="Delete"
            secondaryButtonText="Cancel"
            size="md"
            onRequestClose={onClose}
            loadingStatus={deleteStatus}
            loadingDescription="Deleting..."
            onRequestSubmit={handleDelete}
        >
            <p>
                Check for dependencies on the products before deletion. For instance, if a
                product is assigned to this category, those products will need to be
                removed or reconfigured first.
            </p>
        </Modal>
    );
};
