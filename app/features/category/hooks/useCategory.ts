import {
  createCategory,
  deleteCategory,
  getCategoryGroups,
  getCategoryStatuses,
  paginateCategories,
  PaginateCategoriesParams,
  setCategoryStatus,
  updateCategory,
} from "@/app/services";
import {
  CreateCategoryRequest,
  CreateCategoryResponse,
  ResponseType,
  SetCategoryStatusRequest,
  ValidationResponse,
} from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCategoryGroups = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["category-groups"],
    queryFn: ({ signal }) => getCategoryGroups(signal),
  });

  return { data, isPending, error };
};

export const useGetCategoryStatuses = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["category-statuses"],
    queryFn: ({ signal }) => getCategoryStatuses(signal),
  });

  return { data, isPending, error };
};

export const useCreateCategory = () => {
  return useMutation<
    CreateCategoryResponse,
    ValidationResponse,
    CreateCategoryRequest
  >({
    mutationKey: ["create-category"],
    mutationFn: createCategory,
  });
};

export const useUpdateCategory = () => {
  return useMutation<
    CreateCategoryResponse,
    ValidationResponse,
    { id: number; payload: CreateCategoryRequest }
  >({
    mutationKey: ["update-category"],
    mutationFn: updateCategory,
  });
};

export type HookPaginateCategories = Omit<PaginateCategoriesParams, "signal">;
export const usePaginateCategories = ({
  page,
  limit,
}: HookPaginateCategories) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["paginate-categories", page, limit],
    queryFn: ({ signal }) => paginateCategories({ page, limit, signal }),
  });

  return { data, isPending, error };
};

export const useDeleteCategory = () => {
  return useMutation({
    mutationKey: ["delete-category"],
    mutationFn: deleteCategory,
  });
};

export const useSetCategoryStatus = () => {
  return useMutation<
    ResponseType,
    ValidationResponse,
    SetCategoryStatusRequest
  >({
    mutationKey: ["set-category-status"],
    mutationFn: setCategoryStatus,
  });
};
