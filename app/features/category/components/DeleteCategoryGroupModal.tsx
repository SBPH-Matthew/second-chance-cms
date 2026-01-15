import { Modal } from "@carbon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteCategoryGroup } from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useEffect } from "react";

interface DeleteCategoryGroupModalProps {
  open: boolean;
  onClose: () => void;
  id: number | null;
}

export const DeleteCategoryGroupModal = ({
  open,
  onClose,
  id,
}: DeleteCategoryGroupModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteCategoryGroup,
    isPending: isDeleting,
    isSuccess: successDelete,
    isError: errorDelete,
    reset: resetDelete,
  } = useDeleteCategoryGroup();

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
      deleteCategoryGroup(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["category-groups"],
          });
          setTimeout(() => {
            onClose();
          }, 500);
        },
        onError: (error) => {
          console.error("Error deleting category group:", error);
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      aria-label="Delete category group"
      modalLabel="Category Group resources"
      modalHeading="Are you sure you want to delete this category group?"
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
        category is assigned to this group, those categories will need to be
        removed or reconfigured first.
      </p>
    </Modal>
  );
};
