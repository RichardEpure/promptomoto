import z from "zod";

export enum UserRole {
    USER = "user",
    ADMIN = "admin",
}

const USER_BASE_SCHEMA = z.object({
    username: z
        .string()
        .min(3, "Must be at least 3 characters long.")
        .max(50, "Must be at most 50 characters long."),
    email: z.email("Enter a valid email address."),
});

export const USER_CREATE = {
    schema: USER_BASE_SCHEMA.extend({
        password: z
            .string()
            .min(8, "Must be at least 8 characters long.")
            .max(128, "Must be at most 128 characters long."),
    }),
    defaultValues: () => ({
        username: "",
        email: "",
        password: "",
    }),
};
export type UserCreate = z.infer<typeof USER_CREATE.schema>;

export const USER_PUBLIC = {
    schema: USER_BASE_SCHEMA.extend({
        id: z.uuid(),
        role: z.enum(UserRole),
        created_at: z.string(),
    }),
};
export type UserPublic = z.infer<typeof USER_PUBLIC.schema>;
