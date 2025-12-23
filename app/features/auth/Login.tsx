"use client";
import { ArrowRight } from "@carbon/icons-react";
import {
  Button,
  Form,
  InlineLoading,
  PasswordInput,
  TextInput,
  Theme,
} from "@carbon/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginRequestSchema, LoginRequestType } from "@/app/types";
import { useLogin } from "./hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Login = () => {
  const { mutateAsync: loginPOST, isPending } = useLogin();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginRequestType>({
    resolver: zodResolver(LoginRequestSchema),
    mode: "all",
  });

  const onSubmit = (data: LoginRequestType) => {
    console.log("submit");
    loginPOST(data, {
      onSuccess: () => {
        console.log("success");
        router.push("/dashboard"); // or wherever you want to redirect
      },
      onError: (error) => {
        // Set field-specific errors
        Object.entries(error.errors).forEach(([field, message]) => {
          setError(field as keyof LoginRequestType, {
            type: "server",
            message: message,
          });
        });
        console.error(error);
      },
    });
  };

  return (
    <Theme
      theme="g100"
      className="py-16! flex flex-col justify-center min-h-screen w-full"
    >
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-10 w-full md:w-1/3 px-16!"
      >
        <div className="pb-5! border-b! border-[#525252]!">
          <h1 className="font text-[52px]! pb-2">Login</h1>
          <p className="text-sm!">Enter your login credentials below.</p>
        </div>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput
              {...field}
              id="email"
              type="email"
              labelText="Email"
              size="lg"
              helperText="Enter your registered email."
              invalid={!!errors.email}
              invalidText={errors.email?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              {...field}
              id="password"
              labelText="Password"
              size="lg"
              helperText="Enter your password."
              invalid={!!errors.password}
              invalidText={errors.password?.message}
            />
          )}
        />

        {isPending ? (
          <InlineLoading description="Signing in..." />
        ) : (
          <Button type="submit" kind="primary">
            Sign In
          </Button>
        )}

        <div className="-mt-2! border-b! border-[#525252]!"></div>
      </Form>

      <div className="pt-5! px-16! flex flex-col gap-4">
        <p className="text-sm! text-[#e0e0e0]">Don't have an account?</p>
        <Button
          kind="primary"
          className="w-1/2!"
          renderIcon={(props) => <ArrowRight size={20} {...props} />}
          as={Link}
          href="/register"
        >
          Create an account
        </Button>
      </div>
    </Theme>
  );
};
