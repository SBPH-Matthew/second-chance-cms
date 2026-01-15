import { Modal } from "@carbon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteVehicleType } from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useEffect } from "react";

interface DeleteVehicleTypeModalProps {
  open: boolean;
  onClose: () => void;
  id: number | null;
}

export const DeleteVehicleTypeModal = ({
  open,
  onClose,
  id,
}: DeleteVehicleTypeModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteVehicleType,
    isPending: isDeleting,
    isSuccess: successDelete,
    isError: errorDelete,
    reset: resetDelete,
  } = useDeleteVehicleType();

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
      deleteVehicleType(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["vehicle-types"],
          });
          setTimeout(() => {
            onClose();
          }, 500);
        },
        onError: (error) => {
          console.error("Error deleting vehicle type:", error);
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      aria-label="Delete vehicle type"
      modalLabel="Vehicle Type resources"
      modalHeading="Are you sure you want to delete this vehicle type?"
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
        Check for dependencies on the vehicles before deletion. For instance, if a
        vehicle is assigned to this type, those vehicles will need to be
        removed or reconfigured first.
      </p>
    </Modal>
  );
};
