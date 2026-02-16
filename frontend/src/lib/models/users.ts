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

const USER_LOGIN_SCHEMA = z.object({
    username: z
        .string()
        .min(3, "Must be at least 3 characters long.")
        .max(50, "Must be at most 50 characters long."),
    password: z
        .string()
        .min(8, "Must be at least 8 characters long.")
        .max(128, "Must be at most 128 characters long."),
});
export type UserLogin = z.infer<typeof USER_LOGIN_SCHEMA>;
export const USER_LOGIN = {
    schema: USER_LOGIN_SCHEMA,
    defaultValues: (): UserLogin => ({
        username: "",
        password: "",
    }),
} as const;

const USER_CREATE_SCHEMA = USER_BASE_SCHEMA.extend({
    password: z
        .string()
        .min(8, "Must be at least 8 characters long.")
        .max(128, "Must be at most 128 characters long."),
});
export type UserCreate = z.infer<typeof USER_CREATE_SCHEMA>;
export const USER_CREATE = {
    schema: USER_CREATE_SCHEMA,
    defaultValues: (): UserCreate => ({
        username: "",
        email: "",
        password: "",
    }),
} as const;

const USER_PUBLIC_SCHEMA = USER_BASE_SCHEMA.extend({
    id: z.uuid(),
    role: z.enum(UserRole),
    created_at: z.string(),
});
export type UserPublic = z.infer<typeof USER_PUBLIC_SCHEMA>;
export const USER_PUBLIC = {
    schema: USER_PUBLIC_SCHEMA,
} as const;
