import { changePassword } from "@/app/services";
import { UpdateUserPasswordSchema } from "@/app/types";
import { useMutation } from "@tanstack/react-query";

export const useChangePassword = () => {
    return useMutation<
        any,
        Error,
        { id: number; payload: UpdateUserPasswordSchema }
    >({
        mutationFn: changePassword,
    });
};
