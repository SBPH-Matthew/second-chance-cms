import { Modal } from "@carbon/react";

interface SignOutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SignOutModal = ({
  open,
  onClose,
  onConfirm,
}: SignOutModalProps) => {
  return (
    <Modal
      open={open}
      aria-label="Sign out confirmation"
      modalLabel="Account"
      modalHeading="Are you sure you want to sign out?"
      danger
      primaryButtonText="Sign out"
      secondaryButtonText="Cancel"
      size="md"
      onRequestClose={onClose}
      onRequestSubmit={onConfirm}
    >
      <p>
        Are you sure you want to sign out? You will need to sign in again to access your account.
      </p>
    </Modal>
  );
};
