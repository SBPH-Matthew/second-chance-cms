import { Form, Modal, TextInput } from "@carbon/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  useCreateVehicleType,
  useUpdateVehicleType,
} from "../hooks";
import { useModalLoading } from "@/app/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { VehicleType } from "@/app/types/vehicle";
import { ValidationResponse } from "@/app/types";

const CreateVehicleTypeSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be at most 100 characters" }),
});

type CreateVehicleTypeRequest = z.infer<typeof CreateVehicleTypeSchema>;

interface VehicleTypeModalProps {
  open: boolean;
  onClose: () => void;
  vehicleType: VehicleType | null;
}

export const VehicleTypeModal = ({
  open,
  onClose,
  vehicleType,
}: VehicleTypeModalProps) => {
  const queryClient = useQueryClient();

  const {
    mutateAsync: CreateVehicleType,
    isPending: isCreating,
    isError: createError,
    isSuccess: createSuccess,
    reset: resetCreate,
  } = useCreateVehicleType();

  const {
    mutateAsync: UpdateVehicleType,
    isPending: isUpdating,
    isError: updateError,
    isSuccess: updateSuccess,
    reset: resetUpdate,
  } = useUpdateVehicleType();

  const { status } = useModalLoading({
    loading: isCreating || isUpdating,
    success: createSuccess || updateSuccess,
    error: createError || updateError,
  });

  const form = useForm({
    resolver: zodResolver(CreateVehicleTypeSchema),
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
      if (vehicleType) {
        reset({
          name: vehicleType.name,
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
  }, [open, vehicleType, reset, resetCreate, resetUpdate]);

  const onSubmit = (payload: CreateVehicleTypeRequest) => {
    if (vehicleType) {
      UpdateVehicleType(
        { id: vehicleType.id, payload },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["vehicle-types"],
            });
            setTimeout(() => {
              onClose();
              resetUpdate();
            }, 1000);
          },
          onError: (error: ValidationResponse) => {
            if (error.errors) {
              Object.keys(error.errors).forEach((key) => {
                setError(key as keyof CreateVehicleTypeRequest, {
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
      CreateVehicleType(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["vehicle-types"],
          });
          setTimeout(() => {
            onClose();
            resetCreate();
          }, 1000);
        },
        onError: (error: ValidationResponse) => {
          if (error.errors) {
            Object.keys(error.errors).forEach((key) => {
              setError(key as keyof CreateVehicleTypeRequest, {
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
      aria-label={vehicleType ? "Edit vehicle type" : "Add vehicle type"}
      modalHeading={vehicleType ? "Edit Vehicle Type" : "Add Vehicle Type"}
      open={open}
      onRequestClose={onClose}
      primaryButtonText={vehicleType ? "Save" : "Add"}
      secondaryButtonText="Cancel"
      size="sm"
      loadingStatus={status}
      loadingDescription={vehicleType ? "Updating..." : "Creating..."}
      onRequestSubmit={handleSubmit(onSubmit)}
    >
      <Form className="flex flex-col gap-5">
        <TextInput
          id="name"
          labelText="Name"
          size="lg"
          placeholder="Vehicle Type Name"
          {...register("name")}
          invalid={errors.name ? true : false}
          invalidText={errors.name?.message}
        />
      </Form>
    </Modal>
  );
};
