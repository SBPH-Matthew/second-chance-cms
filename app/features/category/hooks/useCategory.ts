import {
  createCategory,
  createCategoryGroup,
  createCategoryStatus,
  deleteCategory,
  deleteCategoryGroup,
  deleteCategoryStatus,
  getAllCategories,
  getCategoryGroups,
  getCategoryStatuses,
  paginateCategories,
  PaginateCategoriesParams,
  setCategoryStatus,
  updateCategory,
  updateCategoryGroup,
  updateCategoryStatus,
  CreateCategoryGroupRequest,
  CreateCategoryGroupResponse,
  UpdateCategoryGroupResponse,
  CreateCategoryStatusRequest,
  CreateCategoryStatusResponse,
  UpdateCategoryStatusResponse,
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

export const useGetAllCategories = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["all-categories"],
    queryFn: ({ signal }) => getAllCategories(signal),
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

// Category Group hooks
export const useCreateCategoryGroup = () => {
  return useMutation<
    CreateCategoryGroupResponse,
    ValidationResponse,
    CreateCategoryGroupRequest
  >({
    mutationKey: ["create-category-group"],
    mutationFn: createCategoryGroup,
  });
};

export const useUpdateCategoryGroup = () => {
  return useMutation<
    UpdateCategoryGroupResponse,
    ValidationResponse,
    { id: number; payload: CreateCategoryGroupRequest }
  >({
    mutationKey: ["update-category-group"],
    mutationFn: updateCategoryGroup,
  });
};

export const useDeleteCategoryGroup = () => {
  return useMutation({
    mutationKey: ["delete-category-group"],
    mutationFn: deleteCategoryGroup,
  });
};

// Category Status hooks
export const useCreateCategoryStatus = () => {
  return useMutation<
    CreateCategoryStatusResponse,
    ValidationResponse,
    CreateCategoryStatusRequest
  >({
    mutationKey: ["create-category-status"],
    mutationFn: createCategoryStatus,
  });
};

export const useUpdateCategoryStatus = () => {
  return useMutation<
    UpdateCategoryStatusResponse,
    ValidationResponse,
    { id: number; payload: CreateCategoryStatusRequest }
  >({
    mutationKey: ["update-category-status"],
    mutationFn: updateCategoryStatus,
  });
};

export const useDeleteCategoryStatus = () => {
  return useMutation({
    mutationKey: ["delete-category-status"],
    mutationFn: deleteCategoryStatus,
  });
};
