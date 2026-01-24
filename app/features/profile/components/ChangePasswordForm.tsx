import { Button, Form, Stack, Tile, PasswordInput, InlineNotification } from "@carbon/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserPassword, UpdateUserPasswordSchema, User } from "@/app/types";
import { useChangePassword } from "../hooks/useChangePassword";
import { useState } from "react";

interface ChangePasswordFormProps {
    user: User;
}

export const ChangePasswordForm = ({ user }: ChangePasswordFormProps) => {
    const { mutate: changePassword, isPending } = useChangePassword();
    const [serverError, setServerError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserPasswordSchema>({
        resolver: zodResolver(updateUserPassword),
    });

    const onSubmit = (data: UpdateUserPasswordSchema) => {
        setServerError(null);
        setSuccessMessage(null);
        changePassword(
            { id: user.id, payload: data },
            {
                onSuccess: () => {
                    setSuccessMessage("Password updated successfully.");
                    reset();
                },
                onError: (error: any) => {
                    // Backend might return field errors in error.response.data.errors
                    const msg = error?.message || "Failed to update password.";
                    setServerError(msg);
                },
            }
        );
    };

    return (
        <Tile className="p-2! px-4! mb-6! border! border-white/20!">
            <h2 className="text-lg! font-normal! text-white! mb-6!">
                Change Password
            </h2>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={6}>
                    {serverError && (
                        <InlineNotification
                            kind="error"
                            title="Error"
                            subtitle={serverError}
                            hideCloseButton
                        />
                    )}
                    {successMessage && (
                        <InlineNotification
                            kind="success"
                            title="Success"
                            subtitle={successMessage}
                            hideCloseButton
                        />
                    )}

                    <PasswordInput
                        id="old_password"
                        labelText="Current Password"
                        invalid={!!errors.old_password}
                        invalidText={errors.old_password?.message}
                        {...register("old_password")}
                    />

                    <PasswordInput
                        id="new_password"
                        labelText="New Password"
                        invalid={!!errors.new_password}
                        invalidText={errors.new_password?.message}
                        {...register("new_password")}
                    />

                    <PasswordInput
                        id="confirm_password"
                        labelText="Confirm New Password"
                        invalid={!!errors.confirm_password}
                        invalidText={errors.confirm_password?.message}
                        {...register("confirm_password")}
                    />

                    <div className="flex! justify-end! mt-4!">
                        <Button kind="primary" type="submit" disabled={isPending}>
                            {isPending ? "Updating..." : "Update Password"}
                        </Button>
                    </div>
                </Stack>
            </Form>
        </Tile>
    );
};
