"use client";

import {
  Button,
  Form,
  Grid,
  Column,
  InlineNotification,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
  SelectItem,
  SelectSkeleton,
  Stack,
  TextArea,
  TextInput,
  Tile,
  FileUploader,
  PasswordInput,
  Checkbox,
  Tag,
} from "@carbon/react";
import { ArrowLeft } from "@carbon/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateUserPasswordSchema,
  updateUserPassword,
  UpdateUserSchema,
  updateUserSchema,
} from "@/app/types";
import {
  useChangePassword,
  useGetUserById,
  useUpdateUser,
} from "@/app/features/iam/hooks/useIam";
import { useGetRoles } from "@/app/features/roles";
import { useQueryClient } from "@tanstack/react-query";
import { getImageUrl } from "@/app/utils/imageUrl";

export function EditUserV1({ userId }: { userId: number }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: userRes, isPending: isLoadingUser } = useGetUserById(userId);
  const user = userRes?.user;

  const { data: rolesData, isPending: isLoadingRoles } = useGetRoles();
  const roles = rolesData?.roles.items ?? [];

  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  const [tab, setTab] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [existingProfilePicture, setExistingProfilePicture] =
    useState<string>("");
  const [existingIdDocument, setExistingIdDocument] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    setValue,
    watch,
  } = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema) as any,
    mode: "onSubmit",
  });

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    formState: { errors: errorsPass },
    reset: resetPass,
    setError: setErrorPass,
  } = useForm<UpdateUserPasswordSchema>({
    resolver: zodResolver(updateUserPassword),
    mode: "onSubmit",
  });

  const values = watch();

  useEffect(() => {
    if (!user) return;
    reset({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: String(user.role?.id || user.role_id || ""),
      phone: user.phone || "",
      bio: user.bio || "",
      identity_verified: user.identity_verified || false,
      country: user.country || "",
      state_province: user.state_province || "",
      street_address_1: user.street_address_1 || "",
      street_address_2: user.street_address_2 || "",
      zip_postal_code: user.zip_postal_code || "",
      rating: user.rating || 0,
      total_reviews: user.total_reviews || 0,
      existing_profile_picture: user.profile_picture || "",
      existing_id_document: user.id_document || "",
    });
    setExistingProfilePicture(user.profile_picture || "");
    setExistingIdDocument(user.id_document || "");
    setProfilePicture(null);
    setIdDocument(null);
  }, [user, reset]);

  const selectedRoleName = useMemo(() => {
    const r = roles.find((x) => String(x.id) === String(values.role));
    return r?.name || user?.role?.name || "";
  }, [roles, values.role, user?.role?.name]);

  const goBack = () => router.push("/dashboard/user");

  const submitUser = (payload: UpdateUserSchema) => {
    if (!user) return;
    setServerError(null);
    setServerSuccess(null);

    updateUser(
      { id: user.id, payload },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["paginate-users"] });
          await queryClient.invalidateQueries({ queryKey: ["user", user.id] });
          setServerSuccess("Saved changes.");
        },
        onError: (error: any) => {
          if (error?.errors) {
            Object.entries(error.errors).forEach(([field, message]) => {
              setError(field as keyof UpdateUserSchema, {
                type: "server",
                message: message as string,
              });
            });
          }
          setServerError(error?.message || "Failed to update user.");
        },
      },
    );
  };

  const submitPassword = (payload: UpdateUserPasswordSchema) => {
    if (!user) return;
    setPasswordError(null);
    setPasswordSuccess(null);

    changePassword(
      { id: user.id, payload },
      {
        onSuccess: () => {
          setPasswordSuccess("Password updated.");
          resetPass();
        },
        onError: (error: any) => {
          if (error?.errors) {
            Object.entries(error.errors).forEach(([field, message]) => {
              setErrorPass(field as keyof UpdateUserPasswordSchema, {
                type: "server",
                message: message as string,
              });
            });
          }
          setPasswordError(error?.message || "Failed to update password.");
        },
      },
    );
  };

  if (isLoadingUser) {
    return (
      <div className="!py-6 !pr-6">
        <div className="!p-6">Loading user…</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="!py-6 !pr-6">
        <div className="!p-6">
          <InlineNotification
            kind="error"
            title="User not found"
            subtitle="This user may have been deleted."
            hideCloseButton
          />
          <div className="!mt-4">
            <Button kind="ghost" onClick={goBack}>
              Back to Users
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="!py-6 !pr-6">
      <div className="!mb-6">
        <Button kind="ghost" renderIcon={ArrowLeft} onClick={goBack}>
          Back to Users
        </Button>
        <div className="!mt-4 flex items-start justify-between !gap-6">
          <div>
            <h1 className="text-3xl font-semibold">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-sm !mt-2 text-gray-600 dark:text-gray-400">
              Manage user account details, identity verification, address
              information, and security settings. Use the tabs below to navigate
              between different sections.
            </p>
            <div className="!mt-3 flex !gap-2">
              <Tag type="blue">{selectedRoleName || "Role"}</Tag>
              <Tag type={user.identity_verified ? "green" : "gray"}>
                {user.identity_verified
                  ? "Identity verified"
                  : "Identity pending"}
              </Tag>
            </div>
          </div>

          <div className="w-20 h-20 rounded-full overflow-hidden border">
            {user.profile_picture ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getImageUrl(user.profile_picture)}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-lg font-semibold">
                  {(user.first_name?.[0] || "U").toUpperCase()}
                  {(user.last_name?.[0] || "").toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs selectedIndex={tab} onChange={(e) => setTab(e.selectedIndex)}>
        <TabList aria-label="User record tabs">
          <Tab>Overview</Tab>
          <Tab>Details</Tab>
          <Tab>Identity</Tab>
          <Tab>Address</Tab>
          <Tab>Security</Tab>
        </TabList>

        {/* Global success/error notifications visible across all tabs */}
        {(serverSuccess || serverError) && (
          <div className="!mt-4">
            {serverSuccess && (
              <InlineNotification
                kind="success"
                title="Saved"
                subtitle={serverSuccess}
                hideCloseButton
              />
            )}
            {serverError && (
              <InlineNotification
                kind="error"
                title="Error"
                subtitle={serverError}
                hideCloseButton
              />
            )}
          </div>
        )}

        <TabPanels>
          <TabPanel>
            <Grid condensed className="!mt-6">
              <Column sm={4} md={4} lg={8}>
                <Tile className="min-h-56!">
                  <div className="!p-5">
                    <h2 className="text-lg font-semibold">Summary</h2>
                    <div className="!mt-4 !space-y-2 text-sm">
                      <div>Email: {user.email}</div>
                      <div>Role: {selectedRoleName || "—"}</div>
                      <div>Phone: {user.phone || "—"}</div>
                    </div>
                  </div>
                </Tile>
              </Column>
              <Column sm={4} md={4} lg={8}>
                <Tile className="min-h-56!">
                  <div className="!p-5">
                    <h2 className="text-lg font-semibold">Storefront</h2>
                    <div className="!mt-4 !space-y-2 text-sm">
                      <div>Rating: {user.rating ?? 0}</div>
                      <div>Total reviews: {user.total_reviews ?? 0}</div>
                    </div>
                  </div>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid condensed className="!mt-6">
              <Column sm={4} md={8} lg={10}>
                <Tile>
                  <div className="!p-5">
                    <h2 className="text-lg font-semibold">Details</h2>
                    <p className="text-sm !mt-2">Update core user fields.</p>

                    <Form onSubmit={handleSubmit(submitUser as any)}>
                      <div className="!mt-6 !space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 !gap-4">
                          <TextInput
                            id="first_name"
                            labelText="First name"
                            {...register("first_name")}
                            invalid={!!errors.first_name}
                            invalidText={errors.first_name?.message}
                          />
                          <TextInput
                            id="last_name"
                            labelText="Last name"
                            {...register("last_name")}
                            invalid={!!errors.last_name}
                            invalidText={errors.last_name?.message}
                          />
                        </div>

                        <TextInput
                          id="email"
                          labelText="Email"
                          type="email"
                          {...register("email")}
                          invalid={!!errors.email}
                          invalidText={errors.email?.message}
                        />

                        <TextInput
                          id="phone"
                          labelText="Phone"
                          {...register("phone")}
                          invalid={!!errors.phone}
                          invalidText={errors.phone?.message}
                        />

                        {isLoadingRoles ? (
                          <SelectSkeleton />
                        ) : (
                          <Select
                            id="role"
                            labelText="Role"
                            {...register("role")}
                            invalid={!!errors.role}
                            invalidText={errors.role?.message}
                          >
                            {roles.map((r) => (
                              <SelectItem
                                key={r.id}
                                value={String(r.id)}
                                text={r.name}
                              />
                            ))}
                          </Select>
                        )}

                        <div className="flex justify-end !gap-3">
                          <Button
                            kind="secondary"
                            type="button"
                            onClick={goBack}
                          >
                            Done
                          </Button>
                          <Button
                            kind="primary"
                            type="submit"
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Saving..." : "Save changes"}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid condensed className="!mt-6">
              <Column sm={4} md={8} lg={10}>
                <Tile>
                  <div className="!p-5">
                    <h2 className="text-lg font-semibold">Identity</h2>
                    <p className="text-sm !mt-2">
                      Bio, documents and verification.
                    </p>

                    <Form onSubmit={handleSubmit(submitUser as any)}>
                      <div className="!mt-6 !space-y-4">
                        <TextArea
                          id="bio"
                          labelText="Bio"
                          rows={4}
                          {...register("bio")}
                          invalid={!!errors.bio}
                          invalidText={errors.bio?.message}
                        />

                        <FileUploader
                          accept={["image/*"]}
                          buttonKind="primary"
                          buttonLabel="Upload profile picture"
                          filenameStatus="edit"
                          labelTitle="Profile picture"
                          labelDescription="Optional."
                          onChange={(e: any) => {
                            const file = e?.target?.files?.[0];
                            if (!file) return;
                            setProfilePicture(file);
                            setValue("profile_picture", file);
                            setExistingProfilePicture("");
                            setValue("existing_profile_picture", "");
                          }}
                        />
                        {existingProfilePicture && (
                          <div className="text-sm">
                            Current:{" "}
                            <a
                              href={getImageUrl(existingProfilePicture)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          </div>
                        )}

                        <FileUploader
                          accept={["image/*", "application/pdf"]}
                          buttonKind="secondary"
                          buttonLabel="Upload ID document"
                          filenameStatus="edit"
                          labelTitle="ID document"
                          labelDescription="Optional. Image or PDF."
                          onChange={(e: any) => {
                            const file = e?.target?.files?.[0];
                            if (!file) return;
                            setIdDocument(file);
                            setValue("id_document", file);
                            setExistingIdDocument("");
                            setValue("existing_id_document", "");
                          }}
                        />
                        {existingIdDocument && (
                          <div className="text-sm">
                            Current:{" "}
                            <a
                              href={getImageUrl(existingIdDocument)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                          </div>
                        )}

                        <Checkbox
                          id="identity_verified"
                          labelText="Identity verified"
                          checked={values.identity_verified || false}
                          onChange={(checkedOrEvent: any, maybeData?: any) => {
                            const checked =
                              typeof checkedOrEvent === "boolean"
                                ? checkedOrEvent
                                : typeof maybeData?.checked === "boolean"
                                  ? maybeData.checked
                                  : Boolean(checkedOrEvent?.target?.checked);
                            setValue("identity_verified", checked);
                          }}
                        />

                        <div className="flex justify-end !gap-3">
                          <Button
                            kind="secondary"
                            type="button"
                            onClick={goBack}
                          >
                            Done
                          </Button>
                          <Button
                            kind="primary"
                            type="submit"
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Saving..." : "Save changes"}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid condensed className="!mt-6">
              <Column sm={4} md={8} lg={10}>
                <Tile>
                  <div className="!p-5">
                    <h2 className="text-lg font-semibold">Address</h2>
                    <p className="text-sm !mt-2">Update address fields.</p>

                    <Form onSubmit={handleSubmit(submitUser as any)}>
                      <div className="!mt-6 !space-y-4">
                        <TextInput
                          id="street_address_1"
                          labelText="Street address 1"
                          {...register("street_address_1")}
                          invalid={!!errors.street_address_1}
                          invalidText={errors.street_address_1?.message}
                        />
                        <TextInput
                          id="street_address_2"
                          labelText="Street address 2"
                          {...register("street_address_2")}
                          invalid={!!errors.street_address_2}
                          invalidText={errors.street_address_2?.message}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 !gap-4">
                          <TextInput
                            id="state_province"
                            labelText="State / Province"
                            {...register("state_province")}
                            invalid={!!errors.state_province}
                            invalidText={errors.state_province?.message}
                          />
                          <TextInput
                            id="zip_postal_code"
                            labelText="Zip / Postal code"
                            {...register("zip_postal_code")}
                            invalid={!!errors.zip_postal_code}
                            invalidText={errors.zip_postal_code?.message}
                          />
                        </div>
                        <TextInput
                          id="country"
                          labelText="Country"
                          {...register("country")}
                          invalid={!!errors.country}
                          invalidText={errors.country?.message}
                        />

                        <div className="flex justify-end !gap-3">
                          <Button
                            kind="secondary"
                            type="button"
                            onClick={goBack}
                          >
                            Done
                          </Button>
                          <Button
                            kind="primary"
                            type="submit"
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Saving..." : "Save changes"}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid condensed className="!mt-6">
              <Column sm={4} md={8} lg={10}>
                <Tile>
                  <div className="!p-5">
                    <h2 className="text-lg font-semibold">Change password</h2>
                    <p className="text-sm !mt-2">
                      Password updates are submitted separately.
                    </p>

                    <div className="!mt-4">
                      {passwordError && (
                        <InlineNotification
                          kind="error"
                          title="Error"
                          subtitle={passwordError}
                          hideCloseButton
                        />
                      )}
                      {passwordSuccess && (
                        <InlineNotification
                          kind="success"
                          title="Success"
                          subtitle={passwordSuccess}
                          hideCloseButton
                        />
                      )}
                    </div>

                    <Form onSubmit={handleSubmitPass(submitPassword as any)}>
                      <div className="!mt-6 !space-y-4">
                        <PasswordInput
                          id="old_password"
                          labelText="Current password"
                          {...registerPass("old_password")}
                          invalid={!!errorsPass.old_password}
                          invalidText={errorsPass.old_password?.message}
                        />
                        <PasswordInput
                          id="new_password"
                          labelText="New password"
                          {...registerPass("new_password")}
                          invalid={!!errorsPass.new_password}
                          invalidText={errorsPass.new_password?.message}
                        />
                        <PasswordInput
                          id="confirm_password"
                          labelText="Confirm new password"
                          {...registerPass("confirm_password")}
                          invalid={!!errorsPass.confirm_password}
                          invalidText={errorsPass.confirm_password?.message}
                        />

                        <div className="flex justify-end !gap-3">
                          <Button
                            kind="secondary"
                            type="button"
                            onClick={goBack}
                          >
                            Done
                          </Button>
                          <Button
                            kind="primary"
                            type="submit"
                            disabled={isChangingPassword}
                          >
                            {isChangingPassword
                              ? "Updating..."
                              : "Update password"}
                          </Button>
                        </div>
                      </div>
                    </Form>
                  </div>
                </Tile>
              </Column>
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
