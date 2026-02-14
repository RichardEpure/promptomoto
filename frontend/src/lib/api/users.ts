import { BASE_URL, getHeaders, handleResponse } from ".";
import { USER_PUBLIC, UserCreate, UserLogin } from "../models/users";

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
    login: async (userLogin: UserLogin) => {
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
        return USER_PUBLIC.schema.parse(await handleResponse(response));
    },
    me: async () => {
        const response = await fetch(`${BASE_URL}/users/me`, {
            method: "GET",
            headers: getHeaders(),
            credentials: "include",
        });
        return USER_PUBLIC.schema.parse(await handleResponse(response));
    },
};
