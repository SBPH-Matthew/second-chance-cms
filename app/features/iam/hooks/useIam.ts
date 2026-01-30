import {
  changePassword,
  createUser,
  deleteUser,
  getUserById,
  paginateUser,
  PaginateUserParams,
  updateUser,
} from "@/app/services";
import {
  CreateUserSchema,
  GetUserByIdResponse,
  ResponseType,
  UpdateUserPasswordSchema,
  UpdateUserSchema,
  ValidationResponse,
} from "@/app/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type PageUserParams = Omit<PaginateUserParams, "signal">;

export const useGetUserById = (id?: number) => {
  const { data, isPending, error } = useQuery<GetUserByIdResponse>({
    queryKey: ["user", id],
    queryFn: ({ signal }) => getUserById({ id: id as number, signal }),
    enabled: typeof id === "number" && id > 0,
  });

  return { data, isPending, error };
};

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

export const useUpdateUser = () => {
  return useMutation<
    ResponseType,
    ValidationResponse,
    { id: number; payload: UpdateUserSchema }
  >({
    mutationFn: updateUser,
  });
};

export const useChangePassword = () => {
  return useMutation<
    ResponseType,
    ValidationResponse,
    { id: number; payload: UpdateUserPasswordSchema }
  >({
    mutationFn: changePassword,
  });
};

export const useDeleteUser = () => {
  return useMutation<ResponseType, ResponseType, number>({
    mutationFn: deleteUser,
  });
};
