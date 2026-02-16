import z from "zod";

const AI_MODEL_BASE_SCHEMA = z.object({
    name: z
        .string()
        .min(1, "Name is required.")
        .max(100, "Name must be at most 100 characters long."),
    provider: z
        .string()
        .min(1, "Provider is required.")
        .max(100, "Provider must be at most 100 characters long."),
});

const AI_MODEL_SCHEMA = AI_MODEL_BASE_SCHEMA.extend({
    id: z.uuid(),
});
export type AiModel = z.infer<typeof AI_MODEL_SCHEMA>;
export const AI_MODEL = {
    schema: AI_MODEL_SCHEMA,
} as const;

const AI_MODEL_CREATE_SCHEMA = AI_MODEL_BASE_SCHEMA.extend({});
export type AiModelCreate = z.infer<typeof AI_MODEL_CREATE_SCHEMA>;
export const AI_MODEL_CREATE = {
    schema: AI_MODEL_CREATE_SCHEMA,
    defaultValues: (): AiModelCreate => ({
        name: "",
        provider: "",
    }),
} as const;
