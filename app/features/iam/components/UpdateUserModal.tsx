import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
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
    FileUploader,
    Button,
} from "@carbon/react";
import { Information, Close, UserAvatar } from "@carbon/icons-react";
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
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [existingProfilePicture, setExistingProfilePicture] = useState<string | null>(null);

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
        setValue: setValueUpdate,
        watch: watchUpdate,
    } = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateUserSchema),
        mode: "onSubmit",
    });

    // Watch form values for summary preview
    const watchedValues = watchUpdate();

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
                country: user.country || "",
                state_province: user.state_province || "",
                street_address_1: user.street_address_1 || "",
                street_address_2: user.street_address_2 || "",
                zip_postal_code: user.zip_postal_code || "",
                existing_profile_picture: user.profile_picture || "",
            });
            setExistingProfilePicture(user.profile_picture || null);
            setProfilePicture(null);
        } else if (!open) {
            // Reset everything on close
            resetUpdate();
            resetPass();
            UpdateReset();
            PasswordReset();
            setSelectedTab(0);
            setProfilePicture(null);
            setExistingProfilePicture(null);
        }
    }, [open, user, resetUpdate, resetPass, UpdateReset, PasswordReset]);

    const handleFileUpload = (event: { target: { files: FileList | null } }) => {
        const uploadedFiles = Array.from(event.target.files || []);
        if (uploadedFiles.length > 0) {
            const file = uploadedFiles[0];
            setProfilePicture(file);
            setValueUpdate("profile_picture", file);
        }
    };

    const handleRemoveProfilePicture = () => {
        setProfilePicture(null);
        setExistingProfilePicture(null);
        setValueUpdate("profile_picture", undefined);
        setValueUpdate("existing_profile_picture", "");
    };

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

    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0)?.toUpperCase() || '';
        const last = lastName?.charAt(0)?.toUpperCase() || '';
        return `${first}${last}` || 'U';
    };

    const getImageUrl = (imagePath: string) => {
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API || '';
        return `${apiUrl}${imagePath}`;
    };

    const getPreviewImageUrl = (file: File) => {
        return URL.createObjectURL(file);
    };

    const displayProfilePicture = profilePicture 
        ? getPreviewImageUrl(profilePicture)
        : existingProfilePicture 
            ? getImageUrl(existingProfilePicture)
            : null;

    return (
        <ComposedModal
            open={open}
            onClose={onClose}
            size="lg"
        >
            <ModalHeader
                title="Update user"
                label="User Management"
                closeModal={onClose}
            >
                <p className="text-sm mt-2">
                    Update user information below. Name, email, and role are required fields.
                </p>
            </ModalHeader>
            <ModalBody>
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
                            <div className="grid grid-cols-[2fr_1fr] gap-6">
                                {/* Left Column - Form Inputs */}
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-5">
                                        {/* Details Section */}
                                        <div>
                                            <h3 className="text-base font-semibold mb-4">Details</h3>
                                            <div className="space-y-4!">
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
                                            </div>
                                        </div>

                                        {/* Role Section */}
                                        <div>
                                            <h3 className="text-base font-semibold mb-4">Role</h3>
                                            <p className="text-sm mb-4">
                                                Select a role to assign permissions to this user.
                                            </p>
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
                                                    placeholder="Enter or select a role"
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

                                        {/* Profile Picture Section */}
                                        <div>
                                            <h3 className="text-base font-semibold mb-4">Profile Picture</h3>
                                            <FileUploader
                                                accept={["image/*"]}
                                                buttonKind="primary"
                                                buttonLabel="Change profile picture"
                                                filenameStatus="edit"
                                                iconDescription="Delete file"
                                                labelDescription="Only image files are supported. Max file size is 10MB."
                                                labelTitle="Profile Picture"
                                                onChange={handleFileUpload}
                                                size="md"
                                            />
                                            {profilePicture && (
                                                <div className="mt-2 text-sm">
                                                    New: {profilePicture.name}
                                                </div>
                                            )}
                                            {existingProfilePicture && !profilePicture && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium mb-2">Current Profile Picture</p>
                                                    <div className="relative inline-block">
                                                        <img
                                                            src={getImageUrl(existingProfilePicture)}
                                                            alt="Profile"
                                                            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleRemoveProfilePicture}
                                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                            aria-label="Remove profile picture"
                                                        >
                                                            <Close size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Address Section */}
                                        <div>
                                            <h3 className="text-base font-semibold mb-4">Address</h3>
                                            <div className="space-y-4!">
                                                <TextInput
                                                    id="update_country"
                                                    labelText="Country"
                                                    placeholder="Enter country"
                                                    {...updateRegister("country")}
                                                    invalid={!!errorsUpdate.country}
                                                    invalidText={errorsUpdate.country?.message}
                                                />
                                                <TextInput
                                                    id="update_state_province"
                                                    labelText="State / Province"
                                                    placeholder="Enter state or province"
                                                    {...updateRegister("state_province")}
                                                    invalid={!!errorsUpdate.state_province}
                                                    invalidText={errorsUpdate.state_province?.message}
                                                />
                                                <TextInput
                                                    id="update_street_address_1"
                                                    labelText="Street Address #1"
                                                    placeholder="Enter street address"
                                                    {...updateRegister("street_address_1")}
                                                    invalid={!!errorsUpdate.street_address_1}
                                                    invalidText={errorsUpdate.street_address_1?.message}
                                                />
                                                <TextInput
                                                    id="update_street_address_2"
                                                    labelText="Street Address #2 (Optional)"
                                                    placeholder="Enter additional address details"
                                                    {...updateRegister("street_address_2")}
                                                    invalid={!!errorsUpdate.street_address_2}
                                                    invalidText={errorsUpdate.street_address_2?.message}
                                                />
                                                <TextInput
                                                    id="update_zip_postal_code"
                                                    labelText="Zip / Postal Code"
                                                    placeholder="Enter zip or postal code"
                                                    {...updateRegister("zip_postal_code")}
                                                    invalid={!!errorsUpdate.zip_postal_code}
                                                    invalidText={errorsUpdate.zip_postal_code?.message}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Summary */}
                                <div className="border-l border-gray-200 pl-6">
                                    <h3 className="text-base font-semibold mb-4">Summary</h3>
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        {displayProfilePicture ? (
                                            <img
                                                src={displayProfilePicture}
                                                alt="Profile preview"
                                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-4"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                                                <UserAvatar size={48} className="text-gray-400" />
                                            </div>
                                        )}
                                        <div className="text-lg font-semibold mb-2">
                                            {watchedValues.first_name || watchedValues.last_name
                                                ? `${watchedValues.first_name || ''} ${watchedValues.last_name || ''}`.trim()
                                                : user
                                                    ? `${user.first_name} ${user.last_name}`
                                                    : 'No User'}
                                        </div>
                                        <div className="text-sm mb-4">
                                            {watchedValues.email || user?.email || 'No email entered yet'}
                                        </div>
                                        {(watchedValues.role || user?.role_id) && getRoles?.roles.items && (
                                            <div className="text-sm mb-4">
                                                Role: <span className="font-medium capitalize">
                                                    {getRoles.roles.items.find(r => String(r.id) === (watchedValues.role || String(user?.role_id)))?.name || user?.role?.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
            </ModalBody>
            <ModalFooter>
                <Button kind="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={submitUpdates}
                    disabled={Updating || PasswordPending}
                >
                    {Updating || PasswordPending 
                        ? (selectedTab === 0 ? 'Updating...' : 'Changing Password...') 
                        : (selectedTab === 0 ? 'Save changes' : 'Change Password')}
                </Button>
            </ModalFooter>
        </ComposedModal>
    );
};
