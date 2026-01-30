"use client";
import {
  Form,
  TextInput,
  Select,
  SelectItem,
  SelectSkeleton,
  PasswordInput,
  FileUploader,
  Button,
  TextArea,
  Checkbox,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
} from "@carbon/react";
import { UserAvatar, ArrowLeft, Information, Close } from "@carbon/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  UpdateUserSchema,
  updateUserSchema,
  UpdateUserPasswordSchema,
  updateUserPassword,
} from "@/app/types";
import {
  useUpdateUser,
  useChangePassword,
  useGetUserById,
} from "../hooks/useIam";
import { useGetRoles } from "../../roles";
import { useEffect, useState } from "react";
import { ContentLayout } from "@/app/components";

interface EditUserFormProps {
  userId: number;
}

export const EditUserForm = ({ userId }: EditUserFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState(0);
  const { data: getRoles, isPending: loadingRoles } = useGetRoles();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [existingProfilePicture, setExistingProfilePicture] = useState<
    string | null
  >(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [existingIdDocument, setExistingIdDocument] = useState<string | null>(
    null,
  );

  const { data: userResponse, isPending: isLoadingUser } =
    useGetUserById(userId);
  const user = userResponse?.user;

  // Update Mutator
  const { mutateAsync: UpdateUser, isPending: Updating } = useUpdateUser();

  // Change Password Mutator
  const { mutateAsync: ChangePassword, isPending: PasswordPending } =
    useChangePassword();

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
    resolver: zodResolver(updateUserSchema) as any,
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

  // Reset/Populate on user change
  useEffect(() => {
    if (user) {
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
        phone: user.phone || "",
        bio: user.bio || "",
        identity_verified: user.identity_verified || false,
        rating: user.rating || 0,
        total_reviews: user.total_reviews || 0,
        existing_profile_picture: user.profile_picture || "",
        existing_id_document: user.id_document || "",
      });
      setExistingProfilePicture(user.profile_picture || null);
      setExistingIdDocument(user.id_document || null);
      setProfilePicture(null);
      setIdDocument(null);
    }
  }, [user, resetUpdate]);

  const handleFileUpload = (event: { target: { files: FileList | null } }) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      const file = uploadedFiles[0];
      setProfilePicture(file);
      setValueUpdate("profile_picture", file);
    }
  };

  const handleIdDocumentUpload = (event: {
    target: { files: FileList | null };
  }) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length > 0) {
      const file = uploadedFiles[0];
      setIdDocument(file);
      setValueUpdate("id_document", file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setExistingProfilePicture(null);
    setValueUpdate("profile_picture", undefined);
    setValueUpdate("existing_profile_picture", "");
  };

  const handleRemoveIdDocument = () => {
    setIdDocument(null);
    setExistingIdDocument(null);
    setValueUpdate("id_document", undefined);
    setValueUpdate("existing_id_document", "");
  };

  const handleUpdatePayload = (payload: UpdateUserSchema) => {
    if (!user) return;
    UpdateUser(
      { id: user.id, payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["paginate-users"] });
          router.push("/dashboard/user");
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
        },
      },
    );
  };

  const handleChangePassword = (payload: UpdateUserPasswordSchema) => {
    if (!user) return;
    ChangePassword(
      { id: user.id, payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["paginate-users"] });
          router.push("/dashboard/user");
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
        },
      },
    );
  };

  const submitUpdates =
    selectedTab === 0
      ? submitUpdate(handleUpdatePayload as any)
      : submitPass(handleChangePassword as any);

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return `${first}${last}` || "U";
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    const apiUrl = process.env.NEXT_PUBLIC_API || "";
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

  if (isLoadingUser) {
    return (
      <ContentLayout>
        <div className="p-6">
          <p>Loading user...</p>
        </div>
      </ContentLayout>
    );
  }

  if (!user) {
    return (
      <ContentLayout>
        <div className="p-6">
          <p>User not found.</p>
          <Button kind="ghost" onClick={() => router.push("/dashboard/user")}>
            Back to Users
          </Button>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout>
      <div className="p-6">
        <div className="mb-6">
          <Button
            kind="ghost"
            renderIcon={ArrowLeft}
            onClick={() => router.push("/dashboard/user")}
            className="mb-4"
          >
            Back to Users
          </Button>
          <h1 className="text-3xl font-semibold mb-2">Update user</h1>
          <p className="text-sm">
            Update user information below. Name, email, and role are required
            fields.
          </p>
        </div>

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
                        <TextInput
                          id="update_phone"
                          labelText="Phone"
                          placeholder="Enter phone number"
                          {...updateRegister("phone")}
                          invalid={!!errorsUpdate.phone}
                          invalidText={errorsUpdate.phone?.message}
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
                      <h3 className="text-base font-semibold mb-4">
                        Profile Picture
                      </h3>
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
                          <p className="text-sm font-medium mb-2">
                            Current Profile Picture
                          </p>
                          <div className="relative inline-block">
                            <img
                              src={getImageUrl(existingProfilePicture)}
                              alt="Profile"
                              className="w-24 h-24 object-cover rounded-full border-2 border-gray-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
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

                    {/* Identity Section */}
                    <div>
                      <h3 className="text-base font-semibold mb-4">Identity</h3>
                      <div className="space-y-4!">
                        <TextArea
                          id="update_bio"
                          labelText="Bio"
                          placeholder="Enter user bio"
                          rows={4}
                          {...updateRegister("bio")}
                          invalid={!!errorsUpdate.bio}
                          invalidText={errorsUpdate.bio?.message}
                        />
                        <FileUploader
                          accept={["image/*", "application/pdf"]}
                          buttonKind="secondary"
                          buttonLabel="Upload ID Document"
                          filenameStatus="edit"
                          iconDescription="Delete file"
                          labelDescription="Upload a valid ID document (image or PDF). Max file size is 10MB."
                          labelTitle="ID Document"
                          onChange={handleIdDocumentUpload}
                          size="md"
                        />
                        {idDocument && (
                          <div className="mt-2 text-sm">
                            New: {idDocument.name}
                          </div>
                        )}
                        {existingIdDocument && !idDocument && (
                          <div className="mt-4">
                            <p className="text-sm font-medium mb-2">
                              Current ID Document
                            </p>
                            <div className="relative inline-block">
                              <a
                                href={getImageUrl(existingIdDocument)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View Document
                              </a>
                              <button
                                type="button"
                                onClick={handleRemoveIdDocument}
                                className="ml-2 bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 text-sm"
                                aria-label="Remove ID document"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                        <Checkbox
                          id="update_identity_verified"
                          labelText="Identity Verified"
                          checked={watchedValues.identity_verified || false}
                          onChange={(checkedOrEvent: any, maybeData?: any) => {
                            const checked =
                              typeof checkedOrEvent === "boolean"
                                ? checkedOrEvent
                                : typeof maybeData?.checked === "boolean"
                                  ? maybeData.checked
                                  : Boolean(checkedOrEvent?.target?.checked);
                            setValueUpdate("identity_verified", checked);
                          }}
                        />
                      </div>
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

                    {/* Storefront Info Section */}
                    {user?.role?.name?.toLowerCase() !== "admin" && (
                      <div>
                        <h3 className="text-base font-semibold mb-4">
                          Storefront Info
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <TextInput
                            id="update_rating"
                            labelText="Rating"
                            placeholder="0.0"
                            type="number"
                            step="0.1"
                            {...updateRegister("rating")}
                            invalid={!!errorsUpdate.rating}
                            invalidText={errorsUpdate.rating?.message}
                          />
                          <TextInput
                            id="update_total_reviews"
                            labelText="Total Reviews"
                            placeholder="0"
                            type="number"
                            {...updateRegister("total_reviews")}
                            invalid={!!errorsUpdate.total_reviews}
                            invalidText={errorsUpdate.total_reviews?.message}
                          />
                        </div>
                      </div>
                    )}
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
                        ? `${watchedValues.first_name || ""} ${watchedValues.last_name || ""}`.trim()
                        : user
                          ? `${user.first_name} ${user.last_name}`
                          : "No User"}
                    </div>
                    <div className="text-sm mb-4">
                      {watchedValues.email ||
                        user?.email ||
                        "No email entered yet"}
                    </div>
                    {(watchedValues.role || user?.role_id) &&
                      getRoles?.roles.items && (
                        <div className="text-sm mb-4">
                          Role:{" "}
                          <span className="font-medium capitalize">
                            {getRoles.roles.items.find(
                              (r) =>
                                String(r.id) ===
                                (watchedValues.role || String(user?.role_id)),
                            )?.name || user?.role?.name}
                          </span>
                        </div>
                      )}
                    {watchedValues.phone && (
                      <div className="text-sm mb-4">
                        Phone: {watchedValues.phone}
                      </div>
                    )}
                    {watchedValues.identity_verified && (
                      <div className="text-sm mb-4 text-green-600">
                        ✓ Identity Verified
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

        <div className="mt-6 flex gap-4 justify-end">
          <Button
            kind="secondary"
            onClick={() => router.push("/dashboard/user")}
          >
            Cancel
          </Button>
          <Button
            onClick={submitUpdates}
            disabled={Updating || PasswordPending}
          >
            {Updating || PasswordPending
              ? selectedTab === 0
                ? "Updating..."
                : "Changing Password..."
              : selectedTab === 0
                ? "Save changes"
                : "Change Password"}
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
};
