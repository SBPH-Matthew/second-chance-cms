import { Modal } from "@carbon/react";
import { useEffect } from "react";
import { useDeleteProduct } from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteProductModalProps {
  open: boolean;
  productId: number | null;
  productName: string;
  onClose: () => void;
}

export const DeleteProductModal = ({
  open,
  productId,
  productName,
  onClose,
}: DeleteProductModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteProduct,
    isPending: isDeleting,
    isSuccess: successDelete,
    isError: errorDelete,
    reset: resetDelete,
  } = useDeleteProduct();

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
    if (productId) {
      deleteProduct(productId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["paginate-products"],
          });
          setTimeout(() => {
            onClose();
          }, 500);
        },
        onError: (error) => {
          console.error("Error deleting product:", error);
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      aria-label="Delete product"
      modalLabel="Product resources"
      modalHeading="Are you sure you want to delete this product?"
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
        Are you sure you want to delete the product <strong>{productName}</strong>? This action
        cannot be undone.
      </p>
    </Modal>
  );
};
