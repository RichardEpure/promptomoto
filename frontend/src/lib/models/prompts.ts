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
    short_description: z
        .string()
        .max(255, "Short description must be at most 255 characters long.")
        .default(""),
    description: z.string().default(""),
    tags: z.array(z.enum(PromptTag)).default([]),
    ai_model_id: z.uuid(),
});

export const PROMPT = {
    schema: PROMPT_BASE_SCHEMA.extend({
        id: z.uuid(),
        user_id: z.uuid(),
    }),
};
export type Prompt = z.infer<typeof PROMPT.schema>;

export const PROMPT_CREATE = {
    schema: PROMPT_BASE_SCHEMA.extend({}),
    defaultValues: () => ({
        name: "",
        short_description: "",
        description: "",
        tags: [],
        ai_model_id: "",
    }),
};
export type PromptCreate = z.infer<typeof PROMPT_CREATE.schema>;
