import {
  createCategory,
  getCategoryGroups,
  getCategoryStatuses,
  paginateCategories,
  PaginateCategoriesParams,
  updateCategory,
} from "@/app/services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCategoryGroups = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["category-groups"],
    queryFn: getCategoryGroups,
  });

  return { data, isPending, error };
};

export const useGetCategoryStatuses = () => {
  const { data, isPending, error } = useQuery({
    queryKey: ["category-statuses"],
    queryFn: getCategoryStatuses,
  });

  return { data, isPending, error };
};

export const useCreateCategory = () => {
  return useMutation({
    mutationKey: ["create-category"],
    mutationFn: createCategory,
  });
};

export const useUpdateCategory = () => {
  return useMutation({
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
