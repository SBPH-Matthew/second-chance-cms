import { createUser, paginateUser, PaginateUserParams } from "@/app/services";
import {
  CreateUserSchema,
  ResponseType,
  ValidationResponse,
} from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type PageUserParams = Omit<PaginateUserParams, "signal">;
export const useGetPaginateUser = ({ page, limit }: PageUserParams) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["paginate-users", page, limit],
    queryFn: ({ signal }) => paginateUser({ page, limit, signal }),
  });

  return { data, isPending, error };
};

export const useCreateUser = () => {
  return useMutation<ResponseType, ValidationResponse, CreateUserSchema>({
    mutationFn: createUser,
  });
};
