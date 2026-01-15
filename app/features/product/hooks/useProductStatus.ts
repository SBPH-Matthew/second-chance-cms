import {
  getProductStatuses,
  createProductStatus,
  updateProductStatus,
  deleteProductStatus,
  CreateProductStatusRequest,
  CreateProductStatusResponse,
  UpdateProductStatusResponse,
} from "@/app/services";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ValidationResponse } from "@/app/types";

export const useGetProductStatuses = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ["product-statuses"],
        queryFn: ({ signal }) => getProductStatuses(signal),
    });

    return { data, isPending, error };
};

export const useCreateProductStatus = () => {
  return useMutation<
    CreateProductStatusResponse,
    ValidationResponse,
    CreateProductStatusRequest
  >({
    mutationKey: ["create-product-status"],
    mutationFn: createProductStatus,
  });
};

export const useUpdateProductStatus = () => {
  return useMutation<
    UpdateProductStatusResponse,
    ValidationResponse,
    { id: number; payload: CreateProductStatusRequest }
  >({
    mutationKey: ["update-product-status"],
    mutationFn: updateProductStatus,
  });
};

export const useDeleteProductStatus = () => {
  return useMutation({
    mutationKey: ["delete-product-status"],
    mutationFn: deleteProductStatus,
  });
};
