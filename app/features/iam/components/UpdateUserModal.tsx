import {
    Modal,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    TextInput,
    Select,
    SelectItem,
    SelectSkeleton,
    PasswordInput,
    Toggletip,
    ToggletipButton,
    ToggletipContent,
} from "@carbon/react";
import { Information } from "@carbon/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
    UpdateUserSchema,
    updateUserSchema,
    UpdateUserPasswordSchema,
    updateUserPassword,
    User,
} from "@/app/types";
import { useUpdateUser, useChangePassword } from "../hooks/useIam";
import { useGetRoles } from "../../roles";
import { useModalLoading } from "@/app/hooks";
import { useEffect, useState } from "react";

interface UpdateUserModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

export const UpdateUserModal = ({ open, onClose, user }: UpdateUserModalProps) => {
    const queryClient = useQueryClient();
    const [selectedTab, setSelectedTab] = useState(0);
    const { data: getRoles, isPending: loadingRoles } = useGetRoles();

    // Update Mutator
    const {
        mutateAsync: UpdateUser,
        isPending: Updating,
        isError: UpdateError,
        isSuccess: UpdateSuccess,
        reset: UpdateReset,
    } = useUpdateUser();

    // Change Password Mutator
    const {
        mutateAsync: ChangePassword,
        isPending: PasswordPending,
        isError: PasswordError,
        isSuccess: PasswordSuccess,
        reset: PasswordReset,
    } = useChangePassword();

    const { status: UpdateStatus } = useModalLoading({
        loading: Updating || PasswordPending,
        success: UpdateSuccess || PasswordSuccess,
        error: UpdateError || PasswordError,
    });

    // Form for User Details
    const {
        register: updateRegister,
        handleSubmit: submitUpdate,
        formState: { errors: errorsUpdate },
        reset: resetUpdate,
        setError: setErrorUpdate,
    } = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateUserSchema),
        mode: "onSubmit",
    });

    // Form for Password
    const {
        register: passRegister,
        handleSubmit: submitPass,
        formState: { errors: passError },
        reset: resetPass,
        setError: setErrorPass,
    } = useForm<UpdateUserPasswordSchema>({
        resolver: zodResolver(updateUserPassword),
        mode: "onSubmit",
    });

    // Reset/Populate on open/user change
    useEffect(() => {
        if (open && user) {
            resetUpdate({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: String(user.role?.id || user.role_id || ""),
            });
        } else if (!open) {
            // Reset everything on close
            resetUpdate();
            resetPass();
            UpdateReset();
            PasswordReset();
            setSelectedTab(0);
        }
    }, [open, user, resetUpdate, resetPass, UpdateReset, PasswordReset]);

    const handleUpdatePayload = (payload: UpdateUserSchema) => {
        if (!user) return;
        UpdateUser(
            { id: user.id, payload },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["paginate-users"] });
                    setTimeout(() => onClose(), 500);
                },
                onError: (error: any) => {
                    if (error.errors) {
                        Object.entries(error.errors).forEach(([field, message]) => {
                            setErrorUpdate(field as keyof UpdateUserSchema, {
                                type: "server",
                                message: message as string,
                            });
                        });
                    }
                    setTimeout(() => {
                        UpdateReset();
                    }, 2000);
                },
            }
        );
    };

    const handleChangePassword = (payload: UpdateUserPasswordSchema) => {
        if (!user) return;
        ChangePassword(
            { id: user.id, payload },
            {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["paginate-users"] });
                    setTimeout(() => onClose(), 500);
                },
                onError: (error: any) => {
                    if (error.errors) {
                        Object.entries(error.errors).forEach(([field, message]) => {
                            setErrorPass(field as keyof UpdateUserPasswordSchema, {
                                type: "server",
                                message: message as string,
                            });
                        });
                    }
                    setTimeout(() => {
                        PasswordReset();
                    }, 2000);
                },
            }
        );
    };

    const submitUpdates =
        selectedTab === 0
            ? submitUpdate(handleUpdatePayload)
            : submitPass(handleChangePassword);

    return (
        <Modal
            modalLabel="User resources"
            modalHeading="Update User Detail"
            primaryButtonText="Save changes"
            secondaryButtonText="Cancel"
            open={open}
            onRequestClose={onClose}
            shouldSubmitOnEnter
            onRequestSubmit={submitUpdates}
            loadingDescription="Updating user"
            loadingStatus={UpdateStatus}
            id="update"
        >
            <Tabs
                selectedIndex={selectedTab}
                onChange={(value) => setSelectedTab(value.selectedIndex)}
            >
                <TabList>
                    <Tab>User Details</Tab>
                    <Tab>Change Password</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <div className="flex flex-col gap-5 pt-5!">
                            <TextInput
                                id="update_fname"
                                labelText={
                                    <span className="flex items-center gap-1">
                                        First Name
                                        <span className="text-red-500">*</span>
                                    </span>
                                }
                                placeholder="Enter first name"
                                required
                                {...updateRegister("first_name")}
                                invalid={!!errorsUpdate.first_name}
                                invalidText={errorsUpdate.first_name?.message}
                            />
                            <TextInput
                                id="update_lname"
                                labelText={
                                    <span className="flex items-center gap-1">
                                        Last Name
                                        <span className="text-red-500">*</span>
                                    </span>
                                }
                                placeholder="Enter last name"
                                required
                                {...updateRegister("last_name")}
                                invalid={!!errorsUpdate.last_name}
                                invalidText={errorsUpdate.last_name?.message}
                            />
                            <TextInput
                                id="update_email"
                                labelText={
                                    <span className="flex items-center gap-1">
                                        Email
                                        <span className="text-red-500">*</span>
                                    </span>
                                }
                                placeholder="Enter email"
                                required
                                type="email"
                                {...updateRegister("email")}
                                invalid={!!errorsUpdate.email}
                                invalidText={errorsUpdate.email?.message}
                            />

                            {loadingRoles || !getRoles?.roles.total ? (
                                <SelectSkeleton />
                            ) : (
                                <Select
                                    id="role_update"
                                    labelText={
                                        <span className="flex items-center gap-1">
                                            Role
                                            <span className="text-red-500">*</span>
                                        </span>
                                    }
                                    {...updateRegister("role")}
                                    className="capitalize!"
                                    invalid={!!errorsUpdate.role}
                                    invalidText={errorsUpdate.role?.message}
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
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="flex flex-col gap-5">
                            <PasswordInput
                                id="old_password"
                                labelText={
                                    <span className="flex items-center gap-1">
                                        Old Password
                                        <Toggletip>
                                            <ToggletipButton label="Show Information">
                                                <Information />
                                            </ToggletipButton>
                                            <ToggletipContent>
                                                <p>Enter your current password.</p>
                                            </ToggletipContent>
                                        </Toggletip>
                                    </span>
                                }
                                size="md"
                                placeholder="Enter password"
                                required
                                {...passRegister("old_password")}
                                invalid={!!passError.old_password}
                                invalidText={passError.old_password?.message}
                            />

                            <PasswordInput
                                id="new_password"
                                labelText={
                                    <span className="flex items-center gap-1">
                                        New Password
                                        <Toggletip>
                                            <ToggletipButton label="Show Information">
                                                <Information />
                                            </ToggletipButton>
                                            <ToggletipContent>
                                                <p>Create your new password.</p>
                                            </ToggletipContent>
                                        </Toggletip>
                                    </span>
                                }
                                size="md"
                                placeholder="Create password"
                                required
                                {...passRegister("new_password")}
                                invalid={!!passError.new_password}
                                invalidText={passError.new_password?.message}
                            />

                            <PasswordInput
                                id="change_confirm_password"
                                labelText={
                                    <span className="flex items-center gap-1">
                                        Confirm Password
                                        <Toggletip>
                                            <ToggletipButton label="Show Information">
                                                <Information />
                                            </ToggletipButton>
                                            <ToggletipContent>
                                                <p>Re-enter your new password.</p>
                                            </ToggletipContent>
                                        </Toggletip>
                                    </span>
                                }
                                size="md"
                                placeholder="Confirm password"
                                required
                                {...passRegister("confirm_password")}
                                invalid={!!passError.confirm_password}
                                invalidText={passError.confirm_password?.message}
                            />
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Modal>
    );
};
