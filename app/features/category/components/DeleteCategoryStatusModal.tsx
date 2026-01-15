import { Modal } from "@carbon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteCategoryStatus } from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useEffect } from "react";

interface DeleteCategoryStatusModalProps {
  open: boolean;
  onClose: () => void;
  id: number | null;
}

export const DeleteCategoryStatusModal = ({
  open,
  onClose,
  id,
}: DeleteCategoryStatusModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteCategoryStatus,
    isPending: isDeleting,
    isSuccess: successDelete,
    isError: errorDelete,
    reset: resetDelete,
  } = useDeleteCategoryStatus();

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
      deleteCategoryStatus(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["category-statuses"],
          });
          setTimeout(() => {
            onClose();
          }, 500);
        },
        onError: (error) => {
          console.error("Error deleting category status:", error);
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      aria-label="Delete category status"
      modalLabel="Category Status resources"
      modalHeading="Are you sure you want to delete this category status?"
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
        Check for dependencies on the categories before deletion. For instance, if a
        category is assigned to this status, those categories will need to be
        removed or reconfigured first.
      </p>
    </Modal>
  );
};
