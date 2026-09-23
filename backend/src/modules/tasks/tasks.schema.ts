import { z } from "zod";

export const createTaskSchema = z.object({
    title: z.string().trim().min(2).max(200),
    description: z.string().trim().max(2000).optional(),
    dueDate: z.iso.datetime().optional(),
    assigneeId: z.number().int().positive().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().max(2000).optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    dueDate: z.iso.datetime().optional(),
    assigneeId: z.number().int().positive().optional()
})