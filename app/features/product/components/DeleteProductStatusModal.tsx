import { Modal } from "@carbon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteProductStatus } from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useEffect } from "react";

interface DeleteProductStatusModalProps {
  open: boolean;
  onClose: () => void;
  id: number | null;
}

export const DeleteProductStatusModal = ({
  open,
  onClose,
  id,
}: DeleteProductStatusModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteProductStatus,
    isPending: isDeleting,
    isSuccess: successDelete,
    isError: errorDelete,
    reset: resetDelete,
  } = useDeleteProductStatus();

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
      deleteProductStatus(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product-statuses"],
          });
          setTimeout(() => {
            onClose();
          }, 500);
        },
        onError: (error) => {
          console.error("Error deleting product status:", error);
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      aria-label="Delete product status"
      modalLabel="Product Status resources"
      modalHeading="Are you sure you want to delete this product status?"
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
        product is assigned to this status, those products will need to be
        removed or reconfigured first.
      </p>
    </Modal>
  );
};
