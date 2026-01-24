import { updateUser } from "@/app/services";
import { UpdateUserSchema } from "@/app/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, { id: number; payload: UpdateUserSchema }>({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
};
