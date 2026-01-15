import { Modal } from "@carbon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProductCondition } from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useEffect } from "react";

interface DeleteProductConditionModalProps {
  open: boolean;
  onClose: () => void;
  id: number | null;
}

export const DeleteProductConditionModal = ({
  open,
  onClose,
  id,
}: DeleteProductConditionModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteProductCondition,
    isPending: isDeleting,
    isSuccess: successDelete,
    isError: errorDelete,
    reset: resetDelete,
  } = useDeleteProductCondition();

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
      deleteProductCondition(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product-conditions"],
          });
          setTimeout(() => {
            onClose();
          }, 500);
        },
        onError: (error) => {
          console.error("Error deleting product condition:", error);
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      aria-label="Delete product condition"
      modalLabel="Product Condition resources"
      modalHeading="Are you sure you want to delete this product condition?"
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
        product is assigned to this condition, those products will need to be
        removed or reconfigured first.
      </p>
    </Modal>
  );
};
