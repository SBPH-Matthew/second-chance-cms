import { Modal } from "@carbon/react";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateUser, useGetUserById } from "../hooks/useIam";
import { useModalLoading } from "@/app/hooks";
import { useEffect } from "react";
import { UpdateUserSchema } from "@/app/types";

interface VerifyUserModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

export const VerifyUserModal = ({
  open,
  onClose,
  userId,
}: VerifyUserModalProps) => {
  const queryClient = useQueryClient();

  const { data: userData } = useGetUserById(userId || undefined);
  const user = userData?.user;

  const {
    mutateAsync: updateUser,
    isPending: isVerifying,
    isError: verifyError,
    isSuccess: verifySuccess,
    reset: verifyReset,
  } = useUpdateUser();

  const { status: verifyStatus } = useModalLoading({
    loading: isVerifying,
    success: verifySuccess,
    error: verifyError,
  });

  useEffect(() => {
    if (!open) {
      verifyReset();
    }
  }, [open, verifyReset]);

  const handleVerify = () => {
    if (!userId || !user) return;

    // Get current user data and update with identity_verified: true
    const payload: UpdateUserSchema = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: String(user.role?.id || user.role_id || ""),
      identity_verified: true,
      phone: user.phone || "",
      bio: user.bio || "",
      country: user.country || "",
      state_province: user.state_province || "",
      street_address_1: user.street_address_1 || "",
      street_address_2: user.street_address_2 || "",
      zip_postal_code: user.zip_postal_code || "",
      existing_profile_picture: user.profile_picture || "",
      existing_id_document: user.id_document || "",
      rating: user.rating,
      total_reviews: user.total_reviews,
    };

    updateUser(
      {
        id: userId,
        payload,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["paginate-users"],
          });
          queryClient.invalidateQueries({
            queryKey: ["user", userId],
          });

          setTimeout(() => {
            onClose();
          }, 500);
        },
      },
    );
  };

  const displayName = user
    ? `${user.first_name} ${user.last_name}`.trim() || user.email
    : "this user";

  return (
    <Modal
      open={open}
      aria-label="Verify User"
      modalLabel="User Verification"
      modalHeading={`Verify ${displayName}?`}
      primaryButtonText="Verify"
      secondaryButtonText="Cancel"
      size="md"
      onRequestClose={onClose}
      loadingStatus={verifyStatus}
      loadingDescription="Verifying user..."
      onRequestSubmit={handleVerify}
      disabled={!user}
    >
      <p>
        Are you sure you want to verify the identity of{" "}
        <strong>{displayName}</strong>? This action will mark the user's
        identity as verified and grant them access to verified user features.
      </p>
    </Modal>
  );
};
