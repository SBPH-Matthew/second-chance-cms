import { Modal } from "@carbon/react";
import { useEffect } from "react";
import { useDeleteVehicle } from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteVehicleModalProps {
  open: boolean;
  vehicleId: number | null;
  vehicleName: string;
  onClose: () => void;
}

export const DeleteVehicleModal = ({
  open,
  vehicleId,
  vehicleName,
  onClose,
}: DeleteVehicleModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: deleteVehicle,
    isPending: isDeleting,
    isSuccess: successDelete,
    isError: errorDelete,
    reset: resetDelete,
  } = useDeleteVehicle();

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
    if (vehicleId) {
      deleteVehicle(vehicleId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["paginate-vehicles"],
          });
          setTimeout(() => {
            onClose();
          }, 500);
        },
        onError: (error) => {
          console.error("Error deleting vehicle:", error);
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      aria-label="Delete vehicle"
      modalLabel="Vehicle resources"
      modalHeading="Are you sure you want to delete this vehicle?"
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
        Are you sure you want to delete the vehicle <strong>{vehicleName}</strong>? This action
        cannot be undone.
      </p>
    </Modal>
  );
};
