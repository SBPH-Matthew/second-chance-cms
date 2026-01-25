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
        profile_picture: z.instanceof(File).optional(),
        country: z.string().optional(),
        state_province: z.string().optional(),
        street_address_1: z.string().optional(),
        street_address_2: z.string().optional(),
        zip_postal_code: z.string().optional(),
        rating: z.coerce.number().optional().default(0),
        total_reviews: z.coerce.number().optional().default(0),
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
    profile_picture: z.instanceof(File).optional(),
    existing_profile_picture: z.string().optional(),
    country: z.string().optional(),
    state_province: z.string().optional(),
    street_address_1: z.string().optional(),
    street_address_2: z.string().optional(),
    zip_postal_code: z.string().optional(),
    rating: z.coerce.number().optional(),
    total_reviews: z.coerce.number().optional(),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export const updateUserPassword = z
    .object({
        old_password: z
            .string({ message: "Old Password is required" })
            .min(8)
            .max(255),
        new_password: z
            .string({ message: "New Password is required" })
            .min(8)
            .max(255),
        confirm_password: z
            .string({ message: "Confirm Password is required" })
            .min(8)
            .max(255),
    })
    .refine((data) => data.new_password === data.confirm_password, {
        message: "New passwords do not match.",
        path: ["confirm_password"],
    });

export type UpdateUserPasswordSchema = z.infer<typeof updateUserPassword>;
