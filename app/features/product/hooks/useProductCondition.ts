import {
  getProductConditions,
  createProductCondition,
  updateProductCondition,
  deleteProductCondition,
  CreateProductConditionRequest,
  CreateProductConditionResponse,
  UpdateProductConditionResponse,
} from "@/app/services";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ValidationResponse } from "@/app/types";

export const useGetProductConditions = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ["product-conditions"],
        queryFn: ({ signal }) => getProductConditions(signal),
    });

    return { data, isPending, error };
};

export const useCreateProductCondition = () => {
  return useMutation<
    CreateProductConditionResponse,
    ValidationResponse,
    CreateProductConditionRequest
  >({
    mutationKey: ["create-product-condition"],
    mutationFn: createProductCondition,
  });
};

export const useUpdateProductCondition = () => {
  return useMutation<
    UpdateProductConditionResponse,
    ValidationResponse,
    { id: number; payload: CreateProductConditionRequest }
  >({
    mutationKey: ["update-product-condition"],
    mutationFn: updateProductCondition,
  });
};

export const useDeleteProductCondition = () => {
  return useMutation({
    mutationKey: ["delete-product-condition"],
    mutationFn: deleteProductCondition,
  });
};
