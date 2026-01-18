import { Form, Modal, TextInput } from "@carbon/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  useCreateProductStatus,
  useUpdateProductStatus,
} from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ProductStatus } from "@/app/types/product";
import { ValidationResponse } from "@/app/types";

const CreateProductStatusSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be at most 100 characters" }),
});

type CreateProductStatusRequest = z.infer<typeof CreateProductStatusSchema>;

interface ProductStatusModalProps {
  open: boolean;
  onClose: () => void;
  productStatus: ProductStatus | null;
}

export const ProductStatusModal = ({
  open,
  onClose,
  productStatus,
}: ProductStatusModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: CreateProductStatus,
    isPending: isCreating,
    isError: createError,
    isSuccess: createSuccess,
    reset: resetCreate,
  } = useCreateProductStatus();

  const {
    mutateAsync: UpdateProductStatus,
    isPending: isUpdating,
    isError: updateError,
    isSuccess: updateSuccess,
    reset: resetUpdate,
  } = useUpdateProductStatus();

  const { status } = useModalLoading({
    loading: isCreating || isUpdating,
    success: createSuccess || updateSuccess,
    error: createError || updateError,
  });

  const form = useForm({
    resolver: zodResolver(CreateProductStatusSchema),
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
      if (productStatus) {
        reset({
          name: productStatus.name,
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
  }, [open, productStatus, reset, resetCreate, resetUpdate]);

  const onSubmit = (payload: CreateProductStatusRequest) => {
    if (productStatus) {
      UpdateProductStatus(
        { id: productStatus.id, payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["product-statuses"],
            });
            setTimeout(() => {
              onClose();
              resetUpdate();
            }, 1000);
          },
          onError: (error: ValidationResponse) => {
            if (error.errors) {
              Object.keys(error.errors).forEach((key) => {
                setError(key as keyof CreateProductStatusRequest, {
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
      CreateProductStatus(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["product-statuses"],
          });
          setTimeout(() => {
            onClose();
            resetCreate();
          }, 1000);
        },
        onError: (error: ValidationResponse) => {
          if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
              setError(key as keyof CreateProductStatusRequest, {
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
      aria-label={productStatus ? "Edit product status" : "Add product status"}
      modalHeading={productStatus ? "Edit Product Status" : "Add Product Status"}
      open={open}
      onRequestClose={onClose}
      primaryButtonText={productStatus ? "Save" : "Add"}
      secondaryButtonText="Cancel"
      size="sm"
      loadingStatus={status}
      loadingDescription={productStatus ? "Updating..." : "Creating..."}
      onRequestSubmit={handleSubmit(onSubmit)}
    >
      <Form className="flex flex-col gap-5">
        <TextInput
          id="name"
          labelText="Name"
          size="lg"
          placeholder="Product Status Name"
          {...register("name")}
          invalid={errors.name ? true : false}
          invalidText={errors.name?.message}
        />
      </Form>
    </Modal>
  );
};
