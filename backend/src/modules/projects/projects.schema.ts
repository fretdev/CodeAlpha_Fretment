import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(1000).optional(),
    color: z.string().trim().max(20).optional(),
});

export const updateProjectSchema = z
    .object({
        name: z.string().trim().min(2).max(100).optional(),
        description: z.string().trim().max(1000).optional(),
        color: z.string().trim().max(20).optional(),
    })
    .refine(
        (data) =>
            data.name !== undefined ||
            data.description !== undefined ||
            data.color !== undefined,
        {
            message: "At least one field must be provided",
        }
    )
