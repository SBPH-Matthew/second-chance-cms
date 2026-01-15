import { Form, Modal, TextInput } from "@carbon/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  useCreateCategoryStatus,
  useUpdateCategoryStatus,
} from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryStatus as CategoryStatusType } from "@/app/types";
import { ValidationResponse } from "@/app/types";

const CreateCategoryStatusSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be at most 100 characters" }),
});

type CreateCategoryStatusRequest = z.infer<typeof CreateCategoryStatusSchema>;

interface CategoryStatusModalProps {
  open: boolean;
  onClose: () => void;
  categoryStatus: CategoryStatusType | null;
}

export const CategoryStatusModal = ({
  open,
  onClose,
  categoryStatus,
}: CategoryStatusModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: CreateCategoryStatus,
    isPending: isCreating,
    isError: createError,
    isSuccess: createSuccess,
    reset: resetCreate,
  } = useCreateCategoryStatus();

  const {
    mutateAsync: UpdateCategoryStatus,
    isPending: isUpdating,
    isError: updateError,
    isSuccess: updateSuccess,
    reset: resetUpdate,
  } = useUpdateCategoryStatus();

  const { status } = useModalLoading({
    loading: isCreating || isUpdating,
    success: createSuccess || updateSuccess,
    error: createError || updateError,
  });

  const form = useForm({
    resolver: zodResolver(CreateCategoryStatusSchema),
    mode: "all",
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
  } = form;

  useEffect(() => {
    if (open) {
      if (categoryStatus) {
        reset({
          name: categoryStatus.name,
        });
      } else {
        reset({
          name: "",
        });
      }
    } else {
      reset({ name: "" });
      resetCreate();
      resetUpdate();
    }
  }, [open, categoryStatus, reset, resetCreate, resetUpdate]);

  const onSubmit = (payload: CreateCategoryStatusRequest) => {
    if (categoryStatus) {
      UpdateCategoryStatus(
        { id: categoryStatus.id, payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["category-statuses"],
            });
            setTimeout(() => {
              onClose();
              resetUpdate();
            }, 1000);
          },
          onError: (error: ValidationResponse) => {
            if (error.errors) {
              Object.keys(error.errors).forEach((key) => {
                setError(key as keyof CreateCategoryStatusRequest, {
                  message: error.errors[key],
                });
              });
            }
            setTimeout(() => {
              resetUpdate();
            }, 2000);
          },
        },
      );
    } else {
      CreateCategoryStatus(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["category-statuses"],
          });
          setTimeout(() => {
            onClose();
            resetCreate();
          }, 1000);
        },
        onError: (error: ValidationResponse) => {
          if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
              setError(key as keyof CreateCategoryStatusRequest, {
                message: error.errors[key],
              });
            });
          }
          setTimeout(() => {
            resetCreate();
          }, 2000);
        },
      });
    }
  };

  return (
    <Modal
      aria-label={categoryStatus ? "Edit category status" : "Add category status"}
      modalHeading={categoryStatus ? "Edit Category Status" : "Add Category Status"}
      open={open}
      onRequestClose={onClose}
      primaryButtonText={categoryStatus ? "Save" : "Add"}
      secondaryButtonText="Cancel"
      size="sm"
      loadingStatus={status}
      loadingDescription={categoryStatus ? "Updating..." : "Creating..."}
      onRequestSubmit={handleSubmit(onSubmit)}
    >
      <Form className="flex flex-col gap-5">
        <TextInput
          id="name"
          labelText="Name"
          size="lg"
          placeholder="Category Status Name"
          {...register("name")}
          invalid={errors.name ? true : false}
          invalidText={errors.name?.message}
        />
      </Form>
    </Modal>
  );
};
