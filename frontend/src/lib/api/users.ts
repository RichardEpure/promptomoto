import { getHeaders, handleResponse } from ".";
import { USER_PUBLIC, UserCreate } from "../models/users";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreateUserErrorDetail {
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
};
