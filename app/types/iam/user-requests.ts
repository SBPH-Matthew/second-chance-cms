import z from "zod";

export const createUserSchema = z
    .object({
        email: z.email({ message: "Email is required" }).min(3).max(255),
        first_name: z
            .string({ message: "First name is required" })
            .min(2)
            .max(255),
        last_name: z
            .string({ message: "Last name is required" })
            .min(2)
            .max(255),
        password: z.string({ message: "Password is required" }).min(8).max(255),

        confirm_password: z
            .string({ message: "Password is required" })
            .min(8)
            .max(255),
        role: z.string({ message: "Role is required" }),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match.",
        path: ["confirm_password"],
    });

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
    email: z.email({ message: "Email is required" }).min(3).max(255),
    first_name: z.string({ message: "First name is required" }).min(2).max(255),
    last_name: z.string({ message: "Last name is required" }).min(2).max(255),
    role: z.string({ message: "Role is required" }),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
