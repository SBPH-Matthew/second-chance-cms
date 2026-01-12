import { Modal } from "@carbon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSetCategoryStatus } from "../hooks";
import { useModalLoading } from "@/app/hooks";

interface UpdateCategoryStatusModalProps {
    open: boolean;
    onClose: () => void;
    id: number | null;
    statusValue: number | null;
}

export const UpdateCategoryStatusModal = ({
    open,
    onClose,
    id,
    statusValue,
}: UpdateCategoryStatusModalProps) => {
    const queryClient = useQueryClient();

    const {
        mutateAsync: SetCategoryStatus,
        isPending: isSettingStatus,
        isSuccess: statusSuccess,
        isError: statusError,
    } = useSetCategoryStatus();

    const { status: changeStatusPending } = useModalLoading({
        loading: isSettingStatus,
        success: statusSuccess,
        error: statusError,
    });

    const handleChangeStatus = () => {
        if (!statusValue || !id) return;
        SetCategoryStatus(
            {
                id: id,
                status: statusValue,
            },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: ["paginate-categories"],
                    });
                    setTimeout(() => {
                        onClose();
                    }, 500);
                },
            }
        );
    };

    return (
        <Modal
            open={open}
            aria-label="Update status"
            modalLabel="Category resources"
            modalHeading="Are you sure you want to update this category status?"
            primaryButtonText="Save"
            secondaryButtonText="Cancel"
            size="md"
            onRequestClose={onClose}
            loadingStatus={changeStatusPending}
            loadingDescription="Updating..."
            onRequestSubmit={handleChangeStatus}
        >
            <p>Are you sure you want to change the status of this category?</p>
        </Modal>
    );
};
