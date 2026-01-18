import { Form, Modal, TextInput } from "@carbon/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  useCreateProductCondition,
  useUpdateProductCondition,
} from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ProductCondition } from "@/app/types/product";
import { ValidationResponse } from "@/app/types";

const CreateProductConditionSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be at most 100 characters" }),
});

type CreateProductConditionRequest = z.infer<typeof CreateProductConditionSchema>;

interface ProductConditionModalProps {
  open: boolean;
  onClose: () => void;
  productCondition: ProductCondition | null;
}

export const ProductConditionModal = ({
  open,
  onClose,
  productCondition,
}: ProductConditionModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: CreateProductCondition,
    isPending: isCreating,
    isError: createError,
    isSuccess: createSuccess,
    reset: resetCreate,
  } = useCreateProductCondition();

  const {
    mutateAsync: UpdateProductCondition,
    isPending: isUpdating,
    isError: updateError,
    isSuccess: updateSuccess,
    reset: resetUpdate,
  } = useUpdateProductCondition();

  const { status } = useModalLoading({
    loading: isCreating || isUpdating,
    success: createSuccess || updateSuccess,
    error: createError || updateError,
  });

  const form = useForm({
    resolver: zodResolver(CreateProductConditionSchema),
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
      if (productCondition) {
        reset({
          name: productCondition.name,
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
  }, [open, productCondition, reset, resetCreate, resetUpdate]);

  const onSubmit = (payload: CreateProductConditionRequest) => {
    if (productCondition) {
      UpdateProductCondition(
        { id: productCondition.id, payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["product-conditions"],
            });
            setTimeout(() => {
              onClose();
              resetUpdate();
            }, 1000);
          },
          onError: (error: ValidationResponse) => {
            if (error.errors) {
              Object.keys(error.errors).forEach((key) => {
                setError(key as keyof CreateProductConditionRequest, {
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
      CreateProductCondition(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product-conditions"],
          });
          setTimeout(() => {
            onClose();
            resetCreate();
          }, 1000);
        },
        onError: (error: ValidationResponse) => {
          if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
              setError(key as keyof CreateProductConditionRequest, {
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
      aria-label={productCondition ? "Edit product condition" : "Add product condition"}
      modalHeading={productCondition ? "Edit Product Condition" : "Add Product Condition"}
      open={open}
      onRequestClose={onClose}
      primaryButtonText={productCondition ? "Save" : "Add"}
      secondaryButtonText="Cancel"
      size="sm"
      loadingStatus={status}
      loadingDescription={productCondition ? "Updating..." : "Creating..."}
      onRequestSubmit={handleSubmit(onSubmit)}
    >
      <Form className="flex flex-col gap-5">
        <TextInput
          id="name"
          labelText="Name"
          size="lg"
          placeholder="Product Condition Name"
          {...register("name")}
          invalid={errors.name ? true : false}
          invalidText={errors.name?.message}
        />
      </Form>
    </Modal>
  );
};
