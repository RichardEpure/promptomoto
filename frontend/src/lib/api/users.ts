import { getHeaders, handleResponse } from ".";
import { AccessToken } from "../jwt";
import { USER_PUBLIC, UserCreate, UserLogin } from "../models/users";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreateUserErrorDetail {
    type: "user_exists";
    username?: string;
    email?: string;
}

export const usersApi = {
    createUser: async (userCreate: UserCreate) => {
        const response = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(userCreate),
        });
        return USER_PUBLIC.schema.parse(await handleResponse(response));
    },
    loginForAccessToken: async (userLogin: UserLogin) => {
        const body = new URLSearchParams();
        body.append("username", userLogin.username);
        body.append("password", userLogin.password);
        const response = await fetch(`${BASE_URL}/auth/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });
        return handleResponse<AccessToken>(response);
    },
};
