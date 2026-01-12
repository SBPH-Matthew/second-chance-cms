import { Modal } from "@carbon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteUser } from "../hooks/useIam";
import { useModalLoading } from "@/app/hooks";
import { useEffect } from "react";

interface DeleteUserModalProps {
    open: boolean;
    onClose: () => void;
    id: number | null;
}

export const DeleteUserModal = ({ open, onClose, id }: DeleteUserModalProps) => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: DeleteUser,
        isPending: Deleting,
        isError: DeleteError,
        isSuccess: DeleteSuccess,
        reset: DeleteReset,
    } = useDeleteUser();

    const { status: DeleteStatus } = useModalLoading({
        loading: Deleting,
        success: DeleteSuccess,
        error: DeleteError,
    });

    useEffect(() => {
        if (!open) {
            DeleteReset();
        }
    }, [open, DeleteReset]);

    const handleDelete = () => {
        if (!id) return;

        DeleteUser(id, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["paginate-users"],
                });

                setTimeout(() => {
                    onClose();
                }, 500);
            },
        });
    };

    return (
        <Modal
            open={open}
            aria-label="Delete User"
            modalLabel="User resources"
            modalHeading="Are you sure you want to delete this user?"
            danger
            primaryButtonText="Delete"
            secondaryButtonText="Cancel"
            size="md"
            onRequestClose={onClose}
            loadingStatus={DeleteStatus}
            loadingDescription="Deleting..."
            onRequestSubmit={handleDelete}
        >
            <p>
                Check for dependencies on the user before deletion. For instance, if a
                user has products assigned to them, those products will be removed.
            </p>
        </Modal>
    );
};
