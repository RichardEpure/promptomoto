import z from "zod";
import { BASE_URL, getHeaders, handleResponse } from ".";
import { PROMPT } from "../models/prompts";

export const promptsApi = {
    readPrompts: async () => {
        const response = await fetch(`${BASE_URL}/prompts`, {
            method: "GET",
            headers: getHeaders(),
        });
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
