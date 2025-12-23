"use client";
import { CarbonLink } from "@/app/components/CarbonLink";
import { CircleDash, Incomplete } from "@carbon/icons-react";
import {
  Accordion,
  AccordionItem,
  Button,
  Form,
  InlineLoading,
  PasswordInput,
  Stack,
  TextInput,
  Theme,
} from "@carbon/react";
import Link from "next/link";
import { useRegister } from "./hooks";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterRequestSchema, RegisterRequestType } from "@/app/types";
import { useRouter } from "next/navigation";

export const Register = () => {
  const { mutateAsync: registerPOST, isPending } = useRegister();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(RegisterRequestSchema),
    mode: "all",
  });

  const onSubmit = (data: RegisterRequestType) => {
    console.log("submit");
    registerPOST(data, {
      onSuccess: () => {
        console.log("success");
        router.push("/login");
      },
      onError: (error) => {
        Object.entries(error.errors).forEach(([field, message]) => {
          setError(field as keyof RegisterRequestType, {
            type: "server",
            message: message,
          });
        });
        console.error(error);
      },
    });
  };

  return (
    <Theme theme="g100" className="min-h-screen p-5! flex gap-2">
      <div className="md:w-1/2 hidden md:block" />

      <div className="w-full md:w-1/2 md:py-16!">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={3} className="pb-5!">
            <h1 className="register__heading">Register</h1>
            <p>
              Already have an account?{" "}
              <CarbonLink href="/login" as={Link} inline>
                Log in
              </CarbonLink>
            </p>
          </Stack>

          <Accordion size="lg">
            <AccordionItem
              open
              title={
                <div className="flex items-center gap-2">
                  <Incomplete />
                  <p>Account information</p>
                </div>
              }
              className="[&>div]:p-0"
            >
              <div className="flex flex-col gap-4">
                {/* First / Last name */}
                <div className="flex gap-4">
                  <Controller
                    name="first_name"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        id="first_name"
                        labelText="First Name"
                        className="w-1/2"
                        invalid={!!errors.first_name}
                        invalidText={errors.first_name?.message}
                      />
                    )}
                  />

                  <Controller
                    name="last_name"
                    control={control}
                    render={({ field }) => (
                      <TextInput
                        {...field}
                        id="last_name"
                        labelText="Last Name"
                        className="w-1/2"
                        invalid={!!errors.last_name}
                        invalidText={errors.last_name?.message}
                      />
                    )}
                  />
                </div>

                {/* Email */}
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextInput
                      {...field}
                      id="email"
                      type="email"
                      labelText="Email"
                      invalid={!!errors.email}
                      invalidText={errors.email?.message}
                    />
                  )}
                />

                {/* Passwords */}
                <div className="flex gap-4">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        id="password"
                        labelText="Password"
                        className="w-1/2"
                        invalid={!!errors.password}
                        invalidText={errors.password?.message}
                      />
                    )}
                  />

                  <Controller
                    name="confirm_password"
                    control={control}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        id="confirm_password"
                        labelText="Confirm Password"
                        className="w-1/2"
                        invalid={!!errors.confirm_password}
                        invalidText={errors.confirm_password?.message}
                      />
                    )}
                  />
                </div>

                {isPending ? (
                  <InlineLoading description="Submitting..." />
                ) : (
                  <Button type="submit" kind="primary">
                    Register
                  </Button>
                )}
              </div>
            </AccordionItem>

            <AccordionItem
              disabled
              title={
                <div className="flex items-center gap-2">
                  <CircleDash />
                  <p>Verify Email</p>
                </div>
              }
            >
              <p>Email verification will be available after registration.</p>
            </AccordionItem>
          </Accordion>
        </Form>
      </div>
    </Theme>
  );
};
