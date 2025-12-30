interface UseModalLoadingProps {
  loading: boolean;
  success: boolean;
  error: boolean;
}

export type ModalLoadingStatus = "inactive" | "active" | "finished";

export const useModalLoading = ({
  loading,
  success,
  error,
}: UseModalLoadingProps) => {
  // We derive the status immediately during the render cycle
  let status: ModalLoadingStatus = "inactive";

  if (loading) {
    status = "active";
  } else if (success) {
    status = "finished";
  } else if (error) {
    status = "inactive";
  }

  return { status };
};
