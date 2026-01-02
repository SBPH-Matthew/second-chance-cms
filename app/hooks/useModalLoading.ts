interface UseModalLoadingProps {
  loading: boolean;
  success: boolean;
  error: boolean;
}

export type ModalLoadingStatus = "inactive" | "active" | "finished" | "error";

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
    status = "error";
  }

  return { status };
};
