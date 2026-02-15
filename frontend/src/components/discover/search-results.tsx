"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Prompt } from "@/lib/models/prompts";

export function SearchResult({ prompt }: Readonly<{ prompt: Prompt }>) {
    return (
        <Card>
            <CardHeader>
                <CardAction>
                    <Badge variant="secondary">{prompt.tags[0]}</Badge>
                </CardAction>
                <CardTitle>{prompt.name}</CardTitle>
                <CardDescription>{prompt.short_description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button>View Prompt</Button>
            </CardFooter>
        </Card>
    );
}

export function SearchResults() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";

    const [offset, setOffset] = useState(0);

    const query = useQuery({
        queryKey: ["prompt-search", q, offset],
        queryFn: async () => await api.readPrompts(q, offset),
        retry: true,
        staleTime: Infinity,
    });

    const promptsRender = query.isSuccess
        ? query.data.map((prompt) => <SearchResult key={prompt.id} prompt={prompt} />)
        : null;

    return (
        <div className="mx-auto w-full max-w-5xl grow p-8">
            <div className="mb-8 text-zinc-500 dark:text-zinc-400">
                {q && (
                    <p>
                        Showing results for:{" "}
                        <span className="font-medium text-black dark:text-white">{q}</span>
                    </p>
                )}
            </div>
            <div className="grid grid-cols-3 gap-8">{promptsRender}</div>
        </div>
    );
}
