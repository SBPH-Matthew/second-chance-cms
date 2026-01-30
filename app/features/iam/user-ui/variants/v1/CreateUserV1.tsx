"use client";

import {
  Button,
  Form,
  Grid,
  Column,
  InlineNotification,
  ProgressIndicator,
  ProgressStep,
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
} from "@carbon/react";
import { ArrowLeft } from "@carbon/icons-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  FieldPath,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema, createUserSchema } from "@/app/types";
import { useCreateUser } from "@/app/features/iam/hooks/useIam";
import { useGetRoles } from "@/app/features/roles";
import { useQueryClient } from "@tanstack/react-query";

type Step = 0 | 1 | 2;

// Step-specific type definitions using Pick utility type
type Step0Fields = Pick<
  CreateUserSchema,
  | "first_name"
  | "last_name"
  | "email"
  | "role"
  | "password"
  | "confirm_password"
>;

type Step1Fields = Pick<
  CreateUserSchema,
  | "phone"
  | "bio"
  | "country"
  | "state_province"
  | "street_address_1"
  | "street_address_2"
  | "zip_postal_code"
  | "rating"
  | "total_reviews"
>;

// Step 0: Basics Component
function BasicsStep() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<CreateUserSchema>();
  const { data: rolesData, isPending: isLoadingRoles } = useGetRoles();
  const roles = rolesData?.roles.items ?? [];
  const values = watch();

  const selectedRoleName = useMemo(() => {
    const role = roles.find((r) => String(r.id) === String(values.role));
    return role?.name ?? "";
  }, [roles, values.role]);

  return (
    <Grid condensed className="!mt-6">
      <Column sm={4} md={4} lg={8}>
        <Stack gap={6}>
          <Tile>
            <div className="!p-5">
              <h2 className="text-lg font-semibold">User</h2>
              <div className="!mt-4 !space-y-4">
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
              </div>
            </div>
          </Tile>

          <Tile>
            <div className="!p-5">
              <h2 className="text-lg font-semibold">Credentials</h2>
              <div className="!mt-4 !space-y-4">
                <PasswordInput
                  id="password"
                  labelText="Password"
                  {...register("password")}
                  invalid={!!errors.password}
                  invalidText={errors.password?.message}
                />
                <PasswordInput
                  id="confirm_password"
                  labelText="Confirm password"
                  {...register("confirm_password")}
                  invalid={!!errors.confirm_password}
                  invalidText={errors.confirm_password?.message}
                />
              </div>
            </div>
          </Tile>
        </Stack>
      </Column>

      <Column sm={4} md={4} lg={8}>
        <Tile>
          <div className="!p-5">
            <h2 className="text-lg font-semibold">Live preview</h2>
            <p className="text-sm !mt-2">
              This is how the record will look after creation.
            </p>
            <div className="!mt-6 !space-y-3">
              <div className="text-xl">
                {`${values.first_name || ""} ${values.last_name || ""}`.trim() ||
                  "—"}
              </div>
              <div className="text-sm">{values.email || "—"}</div>
              <div className="text-sm">Role: {selectedRoleName || "—"}</div>
            </div>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}

// Step 1: Details Component
function DetailsStep({
  profilePicture,
  setProfilePicture,
  idDocument,
  setIdDocument,
}: {
  profilePicture: File | null;
  setProfilePicture: (file: File | null) => void;
  idDocument: File | null;
  setIdDocument: (file: File | null) => void;
}) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CreateUserSchema>();
  const values = watch();

  return (
    <Grid condensed className="!mt-6">
      <Column sm={4} md={4} lg={10}>
        <Stack gap={6}>
          <Tile>
            <div className="!p-5">
              <h2 className="text-lg font-semibold">Profile</h2>
              <div className="!mt-4 !space-y-4">
                <TextInput
                  id="phone"
                  labelText="Phone"
                  {...register("phone")}
                  invalid={!!errors.phone}
                  invalidText={errors.phone?.message}
                />
                <FileUploader
                  accept={["image/*"]}
                  buttonKind="primary"
                  buttonLabel="Upload profile picture"
                  filenameStatus="edit"
                  labelTitle="Profile picture"
                  labelDescription="Optional. Max 10MB."
                  onChange={(e: any) => {
                    const file = e?.target?.files?.[0];
                    if (!file) return;
                    setProfilePicture(file);
                    setValue("profile_picture", file);
                  }}
                />
                {profilePicture && (
                  <div className="text-sm">Selected: {profilePicture.name}</div>
                )}
              </div>
            </div>
          </Tile>

          <Tile>
            <div className="!p-5">
              <h2 className="text-lg font-semibold">Identity</h2>
              <div className="!mt-4 !space-y-4">
                <TextArea
                  id="bio"
                  labelText="Bio"
                  rows={4}
                  {...register("bio")}
                  invalid={!!errors.bio}
                  invalidText={errors.bio?.message}
                />
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
                  }}
                />
                {idDocument && (
                  <div className="text-sm">Selected: {idDocument.name}</div>
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
              </div>
            </div>
          </Tile>
        </Stack>
      </Column>

      <Column sm={4} md={4} lg={6}>
        <Stack gap={6}>
          <Tile>
            <div className="!p-5">
              <h2 className="text-lg font-semibold">Address</h2>
              <div className="!mt-4 !space-y-4">
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
              </div>
            </div>
          </Tile>

          <Tile>
            <div className="!p-5">
              <h2 className="text-lg font-semibold">Storefront</h2>
              <p className="text-sm !mt-2">
                Optional metrics (primarily for non-admin roles).
              </p>
              <div className="!mt-4 grid grid-cols-1 md:grid-cols-2 !gap-4">
                <TextInput
                  id="rating"
                  labelText="Rating"
                  type="number"
                  step="0.1"
                  {...register("rating")}
                  invalid={!!errors.rating}
                  invalidText={errors.rating?.message}
                />
                <TextInput
                  id="total_reviews"
                  labelText="Total reviews"
                  type="number"
                  {...register("total_reviews")}
                  invalid={!!errors.total_reviews}
                  invalidText={errors.total_reviews?.message}
                />
              </div>
            </div>
          </Tile>
        </Stack>
      </Column>
    </Grid>
  );
}

// Step 2: Review Component
function ReviewStep() {
  const { watch } = useFormContext<CreateUserSchema>();
  const values = watch();
  const { data: rolesData } = useGetRoles();
  const roles = rolesData?.roles.items ?? [];

  const selectedRoleName = useMemo(() => {
    const role = roles.find((r) => String(r.id) === String(values.role));
    return role?.name ?? "";
  }, [roles, values.role]);

  return (
    <Grid condensed className="!mt-6">
      <Column sm={4} md={8} lg={16}>
        <Tile>
          <div className="!p-5">
            <h2 className="text-lg font-semibold">Review</h2>
            <p className="text-sm !mt-2">
              Confirm the information below before creating the user.
            </p>

            <div className="!mt-6 grid grid-cols-1 md:grid-cols-2 !gap-6">
              <Tile>
                <div className="!p-5">
                  <h3 className="text-base font-semibold">Basics</h3>
                  <div className="!mt-3 !space-y-2 text-sm">
                    <div>
                      Name:{" "}
                      {`${values.first_name || ""} ${values.last_name || ""}`.trim() ||
                        "—"}
                    </div>
                    <div>Email: {values.email || "—"}</div>
                    <div>Role: {selectedRoleName || "—"}</div>
                  </div>
                </div>
              </Tile>
              <Tile>
                <div className="!p-5">
                  <h3 className="text-base font-semibold">Details</h3>
                  <div className="!mt-3 !space-y-2 text-sm">
                    <div>Phone: {values.phone || "—"}</div>
                    <div>
                      Identity verified:{" "}
                      {values.identity_verified ? "Yes" : "No"}
                    </div>
                    <div>Country: {values.country || "—"}</div>
                    <div>State/Province: {values.state_province || "—"}</div>
                    <div>Zip: {values.zip_postal_code || "—"}</div>
                  </div>
                </div>
              </Tile>
            </div>
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}

export function CreateUserV1() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutateAsync: createUser, isPending: isCreating } = useCreateUser();

  const [step, setStep] = useState<Step>(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);

  const methods = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema) as any, // Type mismatch between zod refined schema and react-hook-form types
    mode: "onSubmit",
  });

  const {
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
  } = methods;

  const goBack = () => router.push("/dashboard/user");

  // Type-safe step validation using Pick utility type
  const validateStep = async (currentStep: Step): Promise<boolean> => {
    if (currentStep === 0) {
      const fields: FieldPath<CreateUserSchema>[] = [
        "first_name",
        "last_name",
        "email",
        "role",
        "password",
        "confirm_password",
      ];
      return await trigger(fields);
    }
    if (currentStep === 1) {
      const fields: FieldPath<CreateUserSchema>[] = [
        "phone",
        "bio",
        "country",
        "state_province",
        "street_address_1",
        "street_address_2",
        "zip_postal_code",
        "rating",
        "total_reviews",
      ];
      return await trigger(fields);
    }
    return true;
  };

  const next = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    const isValid = await validateStep(step);
    if (!isValid) return;
    setStep((s) => (s === 2 ? 2 : ((s + 1) as Step)));
  };

  const prev = () => setStep((s) => (s === 0 ? 0 : ((s - 1) as Step)));

  const onSubmit = (payload: CreateUserSchema) => {
    setServerError(null);
    createUser(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["paginate-users"] });
        router.push("/dashboard/user");
      },
      onError: (error: unknown) => {
        // Type guard for API error response
        if (
          error &&
          typeof error === "object" &&
          error !== null &&
          "errors" in error &&
          error.errors &&
          typeof error.errors === "object" &&
          error.errors !== null
        ) {
          Object.entries(error.errors).forEach(([field, message]) => {
            setError(field as keyof CreateUserSchema, {
              type: "server",
              message: typeof message === "string" ? message : String(message),
            });
          });
          setServerError(
            error &&
              typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
              ? error.message
              : "Validation failed.",
          );
          return;
        }
        setServerError(
          error &&
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof error.message === "string"
            ? error.message
            : "Failed to create user.",
        );
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="!py-6 !pr-6">
        <div className="!mb-6 flex items-start justify-between !gap-6">
          <div>
            <Button kind="ghost" renderIcon={ArrowLeft} onClick={goBack}>
              Back to Users
            </Button>
            <h1 className="text-3xl font-semibold !mt-4">Create user</h1>
            <p className="text-sm !mt-2 text-gray-600 dark:text-gray-400">
              Create a new user account by providing basic information, profile
              details, and identity verification. Follow the wizard steps to
              complete the registration.
            </p>
          </div>
        </div>

        <Tile>
          <div className="!p-5">
            <ProgressIndicator currentIndex={step} spaceEqually>
              <ProgressStep label="Basics" description="User + credentials" />
              <ProgressStep
                label="Details"
                description="Profile + identity + address"
              />
              <ProgressStep label="Review" description="Confirm & create" />
            </ProgressIndicator>

            <div className="!mt-6">
              {serverError && (
                <InlineNotification
                  kind="error"
                  title="Error"
                  subtitle={serverError}
                  hideCloseButton
                />
              )}

              {Object.keys(errors).length > 0 && (
                <div className="!mt-4">
                  <InlineNotification
                    kind="error"
                    title="Fix the highlighted fields"
                    subtitle="Some required fields are missing or invalid."
                    hideCloseButton
                  />
                </div>
              )}

              <Form
                onSubmit={(e) => {
                  // Only allow form submission on the review step (step 2)
                  if (step !== 2) {
                    e.preventDefault();
                    return;
                  }
                  handleSubmit(onSubmit as (data: CreateUserSchema) => void)(e);
                }}
              >
                {step === 0 && <BasicsStep />}
                {step === 1 && (
                  <DetailsStep
                    profilePicture={profilePicture}
                    setProfilePicture={setProfilePicture}
                    idDocument={idDocument}
                    setIdDocument={setIdDocument}
                  />
                )}
                {step === 2 && <ReviewStep />}

                <div className="!mt-6 flex items-center justify-between">
                  <div className="flex !gap-3">
                    <Button kind="secondary" onClick={goBack} type="button">
                      Cancel
                    </Button>
                  </div>

                  <div className="flex !gap-3">
                    <Button
                      kind="tertiary"
                      onClick={prev}
                      type="button"
                      disabled={step === 0}
                    >
                      Back
                    </Button>

                    {step < 2 ? (
                      <Button kind="primary" onClick={next} type="button">
                        Next
                      </Button>
                    ) : (
                      <Button
                        kind="primary"
                        type="submit"
                        disabled={isCreating}
                      >
                        {isCreating ? "Creating..." : "Create user"}
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Tile>
      </div>
    </FormProvider>
  );
}
