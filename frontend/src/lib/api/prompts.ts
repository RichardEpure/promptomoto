import { BASE_URL, getHeaders, handleResponse } from ".";
import { getPaginatedResponseSchema, PaginatedResponse } from "../models/common";
import { PROMPT, Prompt, PromptCreate, PromptUpdate } from "../models/prompts";

export const promptsApi = {
    readPrompts: async (
        search: string = "",
        offset: number = 0,
        limit: number = 50,
    ): Promise<PaginatedResponse<Prompt>> => {
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });
        if (search) params.append("search", search);

        const response = await fetch(`${BASE_URL}/prompts?${params.toString()}`, {
            method: "GET",
            headers: getHeaders(),
        });
        const data = await handleResponse(response);

        return getPaginatedResponseSchema(PROMPT.schema).parse(data);
    },
    readPrompt: async (id: string) => {
        const response = await fetch(`${BASE_URL}/prompts/${id}`, {
            method: "GET",
            headers: getHeaders(),
        });
        return PROMPT.schema.parse(await handleResponse(response));
    },
    createPrompt: async (promptCreate: PromptCreate) => {
        const response = await fetch(`${BASE_URL}/prompts`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(promptCreate),
            credentials: "include",
        });
        return PROMPT.schema.parse(await handleResponse(response));
    },
    updatePrompt: async (id: string, promptUpdate: PromptUpdate) => {
        const response = await fetch(`${BASE_URL}/prompts/${id}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify(promptUpdate),
            credentials: "include",
        });
        return PROMPT.schema.parse(await handleResponse(response));
    },
};
