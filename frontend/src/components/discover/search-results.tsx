"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Prompt } from "@/lib/models/prompts";
import Paginator from "../paginator";

const PAGE_SIZE = 15;

export function SearchResult({ prompt }: Readonly<{ prompt: Prompt }>) {
    const router = useRouter();
    return (
        <Card>
            <CardHeader>
                <CardAction>
                    <Badge variant="secondary">{prompt.tags[0]}</Badge>
                </CardAction>
                <CardTitle>{prompt.name}</CardTitle>
                <CardDescription>{prompt.short_description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
                <Button onClick={() => router.push(`/prompt/${prompt.id}`)}>View Prompt</Button>
            </CardFooter>
        </Card>
    );
}

export function SearchResults() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";

    const [offset, setOffset] = useState(0);

    const query = useQuery({
        queryKey: ["prompt-search", q, offset, PAGE_SIZE],
        queryFn: async () => await api.readPrompts({ search: q, offset, limit: PAGE_SIZE }),
        retry: true,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });

    const prompts = query.data?.items || [];
    const total = query.data?.total || 0;

    const promptsRender = query.isSuccess
        ? prompts.map((prompt) => <SearchResult key={prompt.id} prompt={prompt} />)
        : null;

    return (
        <div className="mx-auto flex w-full max-w-5xl grow flex-col p-8">
            <div className="mb-8 text-zinc-500 dark:text-zinc-400">
                {q && (
                    <p>
                        Showing results for:{" "}
                        <span className="font-medium text-black dark:text-white">{q}</span>
                    </p>
                )}
            </div>
            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {promptsRender}
                {prompts.length === 0 && query.isSuccess && (
                    <p className="text-muted-foreground col-span-full text-center">
                        No prompts found.
                    </p>
                )}
            </div>
            <Paginator
                total={total}
                pageSize={PAGE_SIZE}
                offset={offset}
                onPageChange={(offset) => setOffset(offset)}
            />
        </div>
    );
}
