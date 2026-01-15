import { Form, Modal, TextInput } from "@carbon/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  useCreateCategoryGroup,
  useUpdateCategoryGroup,
} from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryGroup } from "@/app/types";
import { ValidationResponse } from "@/app/types";

const CreateCategoryGroupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be at most 100 characters" }),
});

type CreateCategoryGroupRequest = z.infer<typeof CreateCategoryGroupSchema>;

interface CategoryGroupModalProps {
  open: boolean;
  onClose: () => void;
  categoryGroup: CategoryGroup | null;
}

export const CategoryGroupModal = ({
  open,
  onClose,
  categoryGroup,
}: CategoryGroupModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: CreateCategoryGroup,
    isPending: isCreating,
    isError: createError,
    isSuccess: createSuccess,
    reset: resetCreate,
  } = useCreateCategoryGroup();

  const {
    mutateAsync: UpdateCategoryGroup,
    isPending: isUpdating,
    isError: updateError,
    isSuccess: updateSuccess,
    reset: resetUpdate,
  } = useUpdateCategoryGroup();

  const { status } = useModalLoading({
    loading: isCreating || isUpdating,
    success: createSuccess || updateSuccess,
    error: createError || updateError,
  });

  const form = useForm({
    resolver: zodResolver(CreateCategoryGroupSchema),
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
      if (categoryGroup) {
        reset({
          name: categoryGroup.name,
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
  }, [open, categoryGroup, reset, resetCreate, resetUpdate]);

  const onSubmit = (payload: CreateCategoryGroupRequest) => {
    if (categoryGroup) {
      UpdateCategoryGroup(
        { id: categoryGroup.id, payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["category-groups"],
            });
            setTimeout(() => {
              onClose();
              resetUpdate();
            }, 1000);
          },
          onError: (error: ValidationResponse) => {
            if (error.errors) {
              Object.keys(error.errors).forEach((key) => {
                setError(key as keyof CreateCategoryGroupRequest, {
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
      CreateCategoryGroup(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["category-groups"],
          });
          setTimeout(() => {
            onClose();
            resetCreate();
          }, 1000);
        },
        onError: (error: ValidationResponse) => {
          if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
              setError(key as keyof CreateCategoryGroupRequest, {
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
      aria-label={categoryGroup ? "Edit category group" : "Add category group"}
      modalHeading={categoryGroup ? "Edit Category Group" : "Add Category Group"}
      open={open}
      onRequestClose={onClose}
      primaryButtonText={categoryGroup ? "Save" : "Add"}
      secondaryButtonText="Cancel"
      size="sm"
      loadingStatus={status}
      loadingDescription={categoryGroup ? "Updating..." : "Creating..."}
      onRequestSubmit={handleSubmit(onSubmit)}
    >
      <Form className="flex flex-col gap-5">
        <TextInput
          id="name"
          labelText="Name"
          size="lg"
          placeholder="Category Group Name"
          {...register("name")}
          invalid={errors.name ? true : false}
          invalidText={errors.name?.message}
        />
      </Form>
    </Modal>
  );
};
