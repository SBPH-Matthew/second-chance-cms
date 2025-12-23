import z from "zod";

export const LoginRequestSchema = z.object({
  email: z.email({ message: "Email is invalid." }),
  password: z
    .string({ message: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters." }),
});

export type LoginRequestType = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z
  .object({
    first_name: z
      .string({ message: "First name is required." })
      .min(1, { message: "First name is required." }),
    last_name: z
      .string({ message: "Last name is required." })
      .min(1, { message: "Last name is required." }),
    email: z.email({ message: "Email is invalid." }),
    password: z
      .string({ message: "Password is required." })
      .min(8, { message: "Password must be at least 8 characters." }),
    confirm_password: z
      .string({ message: "Confirm password is required." })
      .min(8, { message: "Password must be at least 8 characters." }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"], // This shows the error on the confirm_password field
  });

export type RegisterRequestType = z.infer<typeof RegisterRequestSchema>;
