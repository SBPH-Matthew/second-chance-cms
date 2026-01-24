import { Button, Form, Stack, TextInput, Tile, InlineNotification, FileUploader } from "@carbon/react";
import { Close } from "@carbon/icons-react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, UpdateUserSchema, User } from "@/app/types";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/app/utils/imageUrl";

interface ProfileEditFormProps {
    user: User;
    onCancel: () => void;
}

export const ProfileEditForm = ({ user, onCancel }: ProfileEditFormProps) => {
    const { mutate: updateProfile, isPending } = useUpdateProfile();
    const [serverError, setServerError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState<string | null>(user.profile_picture || null);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<UpdateUserSchema>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role_id?.toString(),
            existing_profile_picture: user.profile_picture || "",
            country: user.country || "",
            state_province: user.state_province || "",
            street_address_1: user.street_address_1 || "",
            street_address_2: user.street_address_2 || "",
            zip_postal_code: user.zip_postal_code || "",
        },
    });

    const handleFileUpload = (event: { target: { files: FileList | null } }) => {
        const uploadedFile = event.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            setValue("profile_picture", uploadedFile);
        }
    };

    const handleFileDelete = () => {
        setFile(null);
        setValue("profile_picture", undefined);
    };

    const handleExistingImageDelete = () => {
        setExistingImage(null);
        setValue("existing_profile_picture", "");
    };

    const onSubmit = (data: UpdateUserSchema) => {
        setServerError(null);
        updateProfile(
            { id: user.id, payload: data },
            {
                onSuccess: () => {
                    onCancel(); // Switch back to view mode
                },
                onError: (error: any) => {
                    setServerError(
                        error?.message || "An error occurred while updating the profile."
                    );
                },
            }
        );
    };

    return (
        <Tile className="p-2! px-4! mb-6! border! border-white/20!">
            <div className="flex! items-center! justify-between! mb-6!">
                <h2 className="text-lg! font-normal! text-white! m-0!">
                    Edit Profile
                </h2>
            </div>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap={6}>
                    {serverError && (
                        <InlineNotification
                            kind="error"
                            title="Server Error"
                            subtitle={serverError}
                            hideCloseButton
                        />
                    )}

                    {Object.keys(errors).length > 0 && (
                        <div className="space-y-2">
                            {Object.entries(errors).map(([key, error]) => (
                                <InlineNotification
                                    key={key}
                                    kind="error"
                                    title={`Validation Error: ${key}`}
                                    subtitle={error?.message as string}
                                    hideCloseButton
                                />
                            ))}
                        </div>
                    )}

                    <input type="hidden" {...register("role")} />

                    <div className="flex! gap-6! flex-col md:flex-row">
                        {/* Profile Picture Upload */}
                        <div className="shrink-0!">
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-white">Profile Picture</label>

                                {/* Preview Square */}
                                <div className="size-56! bg-[#525252]! flex! items-center! justify-center! overflow-hidden! relative group">
                                    {file ? (
                                        <>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt="Preview"
                                                className="size-56! object-cover!"
                                            />
                                            <Button
                                                kind="danger"
                                                size="sm"
                                                hasIconOnly
                                                iconDescription="Remove photo"
                                                className="absolute! top-1! right-1! opacity-0 group-hover:opacity-100 transition-opacity z-10!"
                                                onClick={handleFileDelete}
                                            >
                                                <Close size={16} />
                                            </Button>
                                        </>
                                    ) : existingImage ? (
                                        <>
                                            <img
                                                src={getImageUrl(existingImage)}
                                                alt="Current"
                                                className="size-56! object-cover!"
                                            />
                                            <Button
                                                kind="danger"
                                                size="sm"
                                                hasIconOnly
                                                iconDescription="Remove photo"
                                                className="absolute! top-1! right-1! opacity-0 group-hover:opacity-100 transition-opacity z-10!"
                                                onClick={handleExistingImageDelete}
                                            >
                                                <Close size={16} />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="text-white">No Image</div>
                                    )}
                                </div>

                                {/* File Uploader below Preview */}
                                <FileUploader
                                    key={file ? file.name : (existingImage || 'no-file')}
                                    accept={["image/*"]}
                                    buttonKind="primary"
                                    buttonLabel="Upload photo"
                                    filenameStatus="edit"
                                    labelDescription="Max file size is 10MB."
                                    labelTitle=""
                                    multiple={false}
                                    onChange={handleFileUpload}
                                    size="md"
                                />

                                {/* Filename with close icon below FileUploader */}
                                {file && (
                                    <div className="flex items-center justify-between bg-[#525252] p-2 mt-[-8px]">
                                        <span className="text-sm text-white truncate max-w-[150px]">{file.name}</span>
                                        <Button
                                            kind="ghost"
                                            size="sm"
                                            hasIconOnly
                                            iconDescription="Remove file"
                                            onClick={handleFileDelete}
                                            className="text-white hover:bg-white/10"
                                        >
                                            <Close size={16} />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="flex-1! space-y-4!">
                            <div className="flex! gap-4!">
                                <TextInput
                                    id="first_name"
                                    labelText="First Name"
                                    invalid={!!errors.first_name}
                                    invalidText={errors.first_name?.message}
                                    {...register("first_name")}
                                    className="flex-1"
                                />
                                <TextInput
                                    id="last_name"
                                    labelText="Last Name"
                                    invalid={!!errors.last_name}
                                    invalidText={errors.last_name?.message}
                                    {...register("last_name")}
                                    className="flex-1"
                                />
                            </div>

                            <TextInput
                                id="email"
                                labelText="Email"
                                invalid={!!errors.email}
                                invalidText={errors.email?.message}
                                {...register("email")}
                            />

                            <h3 className="text-base! font-normal! text-white! mt-6! mb-2!">Address</h3>

                            <TextInput
                                id="street_address_1"
                                labelText="Street Address 1"
                                invalid={!!errors.street_address_1}
                                invalidText={errors.street_address_1?.message}
                                {...register("street_address_1")}
                            />
                            <TextInput
                                id="street_address_2"
                                labelText="Street Address 2"
                                invalid={!!errors.street_address_2}
                                invalidText={errors.street_address_2?.message}
                                {...register("street_address_2")}
                            />

                            <div className="flex gap-4">
                                <TextInput
                                    id="state_province"
                                    labelText="State/Province"
                                    invalid={!!errors.state_province}
                                    invalidText={errors.state_province?.message}
                                    {...register("state_province")}
                                    className="flex-1"
                                />
                                <TextInput
                                    id="zip_postal_code"
                                    labelText="Zip/Postal Code"
                                    invalid={!!errors.zip_postal_code}
                                    invalidText={errors.zip_postal_code?.message}
                                    {...register("zip_postal_code")}
                                    className="flex-1"
                                />
                            </div>
                            <TextInput
                                id="country"
                                labelText="Country"
                                invalid={!!errors.country}
                                invalidText={errors.country?.message}
                                {...register("country")}
                            />
                        </div>
                    </div>

                    <div className="flex! justify-end! gap-4! mt-4!">
                        <Button kind="secondary" onClick={onCancel} disabled={isPending}>
                            Cancel
                        </Button>
                        <Button kind="primary" type="submit" disabled={isPending}>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </Stack>
            </Form>
        </Tile>
    );
};
