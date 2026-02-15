import { usersApi, CreateUserErrorDetail } from "./users";

export interface GenericErrorDetail {
    type: "generic";
    message: string;
}

type ApiErrorDetail = GenericErrorDetail | CreateUserErrorDetail;

export class ApiError extends Error {
    detail: ApiErrorDetail;
    status: number;

    constructor(detail: ApiErrorDetail, status: number) {
        super("Validation Error");
        if (typeof detail === "object") {
            this.detail = detail;
        } else {
            this.detail = {
                type: "generic",
                message: detail,
            };
        }
        this.status = status;
        this.name = "ApiError";
    }
}

export const BASE_URL = "/api";

export const getHeaders = () => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    return headers;
};

export async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ type: "generic" }));
        if (error.detail) {
            throw new ApiError(error.detail, response.status);
        } else {
            throw new Error(`API request failed: ${response}`);
        }
    }
    if (response.status === 204) {
        return undefined as T;
    }
    return response.json();
}

export const api = {
    ...usersApi,
};
