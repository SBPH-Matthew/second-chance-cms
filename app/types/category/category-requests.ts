import z from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(2, { message: "Name is required" }).max(100),
  // Change to string and transform at the end
  category_group: z
    .string()
    .min(1, { message: "Category group is required" })
    .transform((val) => Number(val)),
  status: z
    .string()
    .min(1, { message: "Status is required" })
    .transform((val) => Number(val)),
});

export type CreateCategoryRequest = z.infer<typeof CreateCategorySchema>;
