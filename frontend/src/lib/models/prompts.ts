import z from "zod";

export enum PromptTag {
    TEXT = "text",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
}

const PROMPT_BASE_SCHEMA = z.object({
    name: z
        .string()
        .min(1, "Name is required.")
        .max(100, "Name must be at most 100 characters long."),
    short_description: z.string().max(255, "Must be at most 255 characters long.").default(""),
    description: z.string().default(""),
    content: z.string().default(""),
    tags: z.array(z.enum(PromptTag)).default([]),
    ai_model_id: z.uuid("Please select a model."),
});

export const PROMPT = {
    schema: PROMPT_BASE_SCHEMA.extend({
        id: z.uuid(),
        user_id: z.uuid(),
    }),
} as const;
export type Prompt = z.infer<typeof PROMPT.schema>;

const PROMPT_UPDATE_SCHEMA = PROMPT_BASE_SCHEMA.partial();
export type PromptUpdate = z.infer<typeof PROMPT_UPDATE_SCHEMA>;
export const PROMPT_UPDATE = {
    schema: PROMPT_UPDATE_SCHEMA,
} as const;

const PROMPT_CREATE_SCHEMA = PROMPT_BASE_SCHEMA.extend({
    short_description: z.string().max(255, "Must be at most 255 characters long."),
    description: z.string(),
    content: z.string(),
    tags: z.array(z.enum(PromptTag)),
});
export type PromptCreate = z.infer<typeof PROMPT_CREATE_SCHEMA>;
export const PROMPT_CREATE = {
    schema: PROMPT_CREATE_SCHEMA,
    defaultValues: (): PromptCreate => ({
        name: "",
        short_description: "",
        description: "",
        content: "",
        tags: [],
        ai_model_id: "",
    }),
} as const;
