import z from "zod";
import { BASE_URL, getHeaders, handleResponse } from ".";
import { AI_MODEL } from "../models/ai-models";

export const aiModelsApi = {
    readAiModels: async () => {
        const response = await fetch(`${BASE_URL}/ai-models`, {
            method: "GET",
            headers: getHeaders(),
        });
        return z.array(AI_MODEL.schema).parse(await handleResponse(response));
    },
    readAiModel: async (id: string) => {
        const response = await fetch(`${BASE_URL}/ai-models/${id}`, {
            method: "GET",
            headers: getHeaders(),
        });
        return AI_MODEL.schema.parse(await handleResponse(response));
    },
};
