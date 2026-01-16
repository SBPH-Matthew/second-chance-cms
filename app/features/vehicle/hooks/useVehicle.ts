import {
  createVehicle,
  deleteVehicle,
  getAllVehicleTypes,
  paginateVehicles,
  PaginateVehiclesParams,
  updateVehicle,
} from "@/app/services/api/vehicle.service";
import { ResponseType, ValidationResponse } from "@/app/types";
import {
  CreateVehicleRequest,
  VehicleTypeResponse,
} from "@/app/types/vehicle";
import { useMutation, useQuery } from "@tanstack/react-query";

export type HookPaginateVehicles = Omit<PaginateVehiclesParams, "signal">;

export const usePaginateVehicles = ({
  page,
  limit,
  search,
}: HookPaginateVehicles) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["paginate-vehicles", page, limit, search],
    queryFn: ({ signal }) =>
      paginateVehicles({ page, limit, search, signal }),
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
