import z from "zod";

export const getPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        items: z.array(itemSchema),
        total: z.number(),
    });

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}
