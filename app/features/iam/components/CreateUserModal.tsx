import {
    Modal,
    Form,
    TextInput,
    Select,
    SelectItem,
    SelectSkeleton,
    PasswordInput,
} from "@carbon/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CreateUserSchema, createUserSchema } from "@/app/types";
import { useCreateUser } from "../hooks/useIam";
import { useGetRoles } from "../../roles";
import { useModalLoading } from "@/app/hooks";
import { useEffect } from "react";

interface CreateUserModalProps {
    open: boolean;
    onClose: () => void;
}

export const CreateUserModal = ({ open, onClose }: CreateUserModalProps) => {
    const queryClient = useQueryClient();
    const { data: getRoles, isPending: loadingRoles } = useGetRoles();

    const {
        mutateAsync: CreateUser,
        isPending: Creating,
        isError: CreateError,
        isSuccess: CreateSuccess,
        reset: CreateReset,
    } = useCreateUser();

    const { status: CreateStatus } = useModalLoading({
        loading: Creating,
        success: CreateSuccess,
        error: CreateError,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<CreateUserSchema>({
        resolver: zodResolver(createUserSchema),
        mode: "onSubmit",
    });

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!open) {
            reset();
            CreateReset();
        }
    }, [open, reset, CreateReset]);

    const handlePayload = (payload: CreateUserSchema) => {
        CreateUser(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["paginate-users"],
                });
                setTimeout(() => {
                    onClose(); // Close will trigger the reset in useEffect
                }, 500);
            },
            onError: (error: any) => {
                if (error.errors) {
                    Object.entries(error.errors).forEach(([field, message]) => {
                        setError(field as keyof CreateUserSchema, {
                            type: "server",
                            message: message as string,
                        });
                    });
                }
            },
        });
    };

    return (
        <Modal
            open={open}
            modalLabel="User resources"
            modalHeading="Add User"
            onRequestClose={onClose}
            primaryButtonText="Add"
            secondaryButtonText="Cancel"
            size="sm"
            loadingStatus={CreateStatus}
            onRequestSubmit={handleSubmit(handlePayload)}
            shouldSubmitOnEnter
        >
            <Form className="flex flex-col gap-5">
                <TextInput
                    id="first_name"
                    labelText={
                        <span className="flex items-center gap-1">
                            First Name
                            <span className="text-red-500">*</span>
                        </span>
                    }
                    placeholder="Enter first name"
                    required
                    {...register("first_name")}
                    invalid={!!errors.first_name}
                    invalidText={errors.first_name?.message}
                />
                <TextInput
                    id="last_name"
                    labelText={
                        <span className="flex items-center gap-1">
                            Last Name
                            <span className="text-red-500">*</span>
                        </span>
                    }
                    placeholder="Enter last name"
                    required
                    {...register("last_name")}
                    invalid={!!errors.last_name}
                    invalidText={errors.last_name?.message}
                />
                <TextInput
                    id="email"
                    labelText={
                        <span className="flex items-center gap-1">
                            Email
                            <span className="text-red-500">*</span>
                        </span>
                    }
                    placeholder="Enter email"
                    required
                    {...register("email")}
                    invalid={!!errors.email}
                    invalidText={errors.email?.message}
                />

                {loadingRoles || !getRoles?.roles.total ? (
                    <SelectSkeleton />
                ) : (
                    <Select
                        id="role"
                        labelText={
                            <span className="flex items-center gap-1">
                                Role
                                <span className="text-red-500">*</span>
                            </span>
                        }
                        {...register("role")}
                        className="capitalize!"
                        invalid={!!errors.role}
                        invalidText={errors.role?.message}
                    >
                        {getRoles?.roles.items.map((role) => (
                            <SelectItem
                                className="capitalize"
                                key={role.id}
                                value={role.id}
                                text={role.name}
                            />
                        ))}
                    </Select>
                )}
                <PasswordInput
                    id="password"
                    labelText={
                        <span className="flex items-center gap-1">
                            Password
                            <span className="text-red-500">*</span>
                        </span>
                    }
                    size="md"
                    placeholder="Create password"
                    required
                    {...register("password")}
                    invalid={!!errors.password}
                    invalidText={errors.password?.message}
                />

                <PasswordInput
                    id="confirm_password"
                    labelText={
                        <span className="flex items-center gap-1">
                            Confirm Password
                            <span className="text-red-500">*</span>
                        </span>
                    }
                    size="md"
                    placeholder="Confirm password"
                    required
                    {...register("confirm_password")}
                    invalid={!!errors.confirm_password}
                    invalidText={errors.confirm_password?.message}
                />
            </Form>
        </Modal>
    );
};
