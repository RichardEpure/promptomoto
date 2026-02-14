import { usersApi } from "./users";

export interface CreateUserErrorDetail {
    type: "user_exists";
    username?: string;
    email?: string;
}

type ApiErrorDetail = CreateUserErrorDetail;

export class ApiError extends Error {
    detail: ApiErrorDetail;
    constructor(detail: ApiErrorDetail) {
        super("Validation Error");
        this.detail = detail;
        this.name = "ApiError";
    }
}

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getHeaders = () => ({
    "Content-Type": "application/json",
});

export async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        if (error.detail) {
            throw new ApiError(error.detail);
        } else {
            throw new Error(`API request failed: ${response}`);
        }
    }
    return response.json();
}

export const api = {
    ...usersApi,
};
