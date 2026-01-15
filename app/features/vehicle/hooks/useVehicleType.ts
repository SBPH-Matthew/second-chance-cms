import {
  createVehicleType,
  deleteVehicleType,
  getVehicleTypes,
  updateVehicleType,
} from "@/app/services/api/vehicle-type.service";
import {
  VehicleTypeResponse,
  ValidationResponse,
} from "@/app/types/vehicle";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetVehicleTypes = () => {
  const { data, isPending, error } = useQuery<VehicleTypeResponse>({
    queryKey: ["vehicle-types"],
    queryFn: ({ signal }) => getVehicleTypes(signal),
  });

  return { data, isPending, error };
};

export interface CreateVehicleTypeRequest {
  name: string;
}

export const useCreateVehicleType = () => {
  return useMutation<
    any,
    ValidationResponse,
    CreateVehicleTypeRequest
  >({
    mutationKey: ["create-vehicle-type"],
    mutationFn: createVehicleType,
  });
};

export const useUpdateVehicleType = () => {
  return useMutation<
    any,
    ValidationResponse,
    { id: number; payload: CreateVehicleTypeRequest }
  >({
    mutationKey: ["update-vehicle-type"],
    mutationFn: updateVehicleType,
  });
};

export const useDeleteVehicleType = () => {
  return useMutation<any, unknown, number>({
    mutationKey: ["delete-vehicle-type"],
    mutationFn: deleteVehicleType,
  });
};
