import z from "zod";
import { BASE_URL, getHeaders, handleResponse } from ".";
import { PROMPT } from "../models/prompts";

export const promptsApi = {
    readPrompts: async (search: string = "", offset: number = 0, limit: number = 50) => {
        const response = await fetch(
            `${BASE_URL}/prompts?search=${search}&offset=${offset}&limit=${limit}`,
            {
                method: "GET",
                headers: getHeaders(),
            },
        );
        return z.array(PROMPT.schema).parse(await handleResponse(response));
    },
    readPrompt: async (id: string) => {
        const response = await fetch(`${BASE_URL}/prompts/${id}`, {
            method: "GET",
            headers: getHeaders(),
        });
        return PROMPT.schema.parse(await handleResponse(response));
    },
};
