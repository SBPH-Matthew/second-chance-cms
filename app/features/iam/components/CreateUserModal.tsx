import {
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    TextInput,
    Select,
    SelectItem,
    SelectSkeleton,
    PasswordInput,
    FileUploader,
    Button,
    TextArea,
} from "@carbon/react";
import { UserAvatar } from "@carbon/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CreateUserSchema, createUserSchema } from "@/app/types";
import { useCreateUser } from "../hooks/useIam";
import { useGetRoles } from "../../roles";
import { useModalLoading } from "@/app/hooks";
import { useEffect, useState } from "react";

interface CreateUserModalProps {
    open: boolean;
    onClose: () => void;
}

export const CreateUserModal = ({ open, onClose }: CreateUserModalProps) => {
    const queryClient = useQueryClient();
    const { data: getRoles, isPending: loadingRoles } = useGetRoles();
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

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
        setValue,
        watch,
    } = useForm<CreateUserSchema>({
        resolver: zodResolver(createUserSchema),
        mode: "onSubmit",
    });

    // Watch form values for summary preview
    const watchedValues = watch();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!open) {
            reset();
            CreateReset();
            setProfilePicture(null);
        }
    }, [open, reset, CreateReset]);

    const handleFileUpload = (event: { target: { files: FileList | null } }) => {
        const uploadedFiles = Array.from(event.target.files || []);
        if (uploadedFiles.length > 0) {
            const file = uploadedFiles[0];
            setProfilePicture(file);
            setValue("profile_picture", file);
        }
    };

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
                setTimeout(() => {
                    CreateReset();
                }, 2000);
            },
        });
    };

    const getInitials = (firstName?: string, lastName?: string) => {
        const first = firstName?.charAt(0)?.toUpperCase() || '';
        const last = lastName?.charAt(0)?.toUpperCase() || '';
        return `${first}${last}` || 'U';
    };

    const getImageUrl = (file: File) => {
        return URL.createObjectURL(file);
    };

    return (
        <ComposedModal
            open={open}
            onClose={onClose}
            size="lg"
        >
            <ModalHeader
                title="Create a new user"
                label="User Management"
                closeModal={onClose}
            >
                <p className="text-sm mt-2">
                    To create a new user, enter the required information below. Name, email, password, and role are required fields.
                </p>
            </ModalHeader>
            <ModalBody>
                <div className="grid grid-cols-[2fr_1fr] gap-6">
                    {/* Left Column - Form Inputs */}
                    <div className="space-y-6">
                        <Form className="flex flex-col gap-5">
                            {/* Details Section */}
                            <div>
                                <h3 className="text-base font-semibold mb-4">Details</h3>
                                <div className="space-y-4!">
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
                            </div>

                            {/* Security Section */}
                            <div>
                                <h3 className="text-base font-semibold mb-4">Security</h3>
                                <div className="space-y-4!">
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
                                </div>
                            </div>

                            {/* Profile Picture Section */}
                            <div>
                                <h3 className="text-base font-semibold mb-4">Profile Picture</h3>
                                <FileUploader
                                    accept={["image/*"]}
                                    buttonKind="primary"
                                    buttonLabel="Add profile picture"
                                    filenameStatus="edit"
                                    iconDescription="Delete file"
                                    labelDescription="Only image files are supported. Max file size is 10MB."
                                    labelTitle="Profile Picture"
                                    onChange={handleFileUpload}
                                    size="md"
                                />
                                {profilePicture && (
                                    <div className="mt-2 text-sm">
                                        Selected: {profilePicture.name}
                                    </div>
                                )}
                            </div>

                            {/* Address Section */}
                            <div>
                                <h3 className="text-base font-semibold mb-4">Address</h3>
                                <div className="space-y-4!">
                                    <TextInput
                                        id="country"
                                        labelText="Country"
                                        placeholder="Enter country"
                                        {...register("country")}
                                        invalid={!!errors.country}
                                        invalidText={errors.country?.message}
                                    />
                                    <TextInput
                                        id="state_province"
                                        labelText="State / Province"
                                        placeholder="Enter state or province"
                                        {...register("state_province")}
                                        invalid={!!errors.state_province}
                                        invalidText={errors.state_province?.message}
                                    />
                                    <TextInput
                                        id="street_address_1"
                                        labelText="Street Address #1"
                                        placeholder="Enter street address"
                                        {...register("street_address_1")}
                                        invalid={!!errors.street_address_1}
                                        invalidText={errors.street_address_1?.message}
                                    />
                                    <TextInput
                                        id="street_address_2"
                                        labelText="Street Address #2 (Optional)"
                                        placeholder="Enter additional address details"
                                        {...register("street_address_2")}
                                        invalid={!!errors.street_address_2}
                                        invalidText={errors.street_address_2?.message}
                                    />
                                    <TextInput
                                        id="zip_postal_code"
                                        labelText="Zip / Postal Code"
                                        placeholder="Enter zip or postal code"
                                        {...register("zip_postal_code")}
                                        invalid={!!errors.zip_postal_code}
                                        invalidText={errors.zip_postal_code?.message}
                                    />
                                </div>
                            </div>
                        </Form>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="border-l border-gray-200 pl-6">
                        <h3 className="text-base font-semibold mb-4">Summary</h3>
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            {profilePicture ? (
                                <img
                                    src={getImageUrl(profilePicture)}
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
                                    : 'No User'}
                            </div>
                            <div className="text-sm mb-4">
                                {watchedValues.email || 'No email entered yet'}
                            </div>
                            {watchedValues.role && getRoles?.roles.items.find(r => String(r.id) === watchedValues.role) && (
                                <div className="text-sm mb-4">
                                    Role: <span className="font-medium capitalize">
                                        {getRoles.roles.items.find(r => String(r.id) === watchedValues.role)?.name}
                                    </span>
                                </div>
                            )}
                            {(!watchedValues.first_name && !watchedValues.last_name && !watchedValues.email) && (
                                <p className="text-sm max-w-xs">
                                    You haven't entered any user details yet. Fill in the form to see a preview here.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button kind="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit(handlePayload)}
                    disabled={Creating}
                >
                    {Creating ? 'Creating...' : 'Create'}
                </Button>
            </ModalFooter>
        </ComposedModal>
    );
};
