import {
  createVehicle,
  deleteVehicle,
  getAllVehicleTypes,
  paginateVehicles,
  PaginateVehiclesParams,
  updateVehicle,
} from "@/app/services/api/vehicle.service";
import {
  CreateVehicleRequest,
  ResponseType,
  ValidationResponse,
  VehicleTypeResponse,
} from "@/app/types/vehicle";
import { useMutation, useQuery } from "@tanstack/react-query";

export type HookPaginateVehicles = Omit<PaginateVehiclesParams, "signal">;

export const usePaginateVehicles = ({ page, limit }: HookPaginateVehicles) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["paginate-vehicles", page, limit],
    queryFn: ({ signal }) => paginateVehicles({ page, limit, signal }),
  });

  return { data, isPending, error };
};

export const useCreateVehicle = () => {
  return useMutation<
    ResponseType,
    ValidationResponse,
    CreateVehicleRequest
  >({
    mutationKey: ["create-vehicle"],
    mutationFn: createVehicle,
  });
};

export const useUpdateVehicle = () => {
  return useMutation<
    ResponseType,
    ValidationResponse,
    { id: number; payload: CreateVehicleRequest; initialData?: any }
  >({
    mutationKey: ["update-vehicle"],
    mutationFn: updateVehicle,
  });
};

export const useDeleteVehicle = () => {
  return useMutation<ResponseType, unknown, number>({
    mutationKey: ["delete-vehicle"],
    mutationFn: deleteVehicle,
  });
};

export const useGetVehicleTypes = () => {
  const { data, isPending, error } = useQuery<VehicleTypeResponse>({
    queryKey: ["vehicle-types"],
    queryFn: getAllVehicleTypes,
  });

  return { data, isPending, error };
};
