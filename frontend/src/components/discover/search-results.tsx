"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Prompt } from "@/lib/models/prompts";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "../ui/pagination";

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
    const limit = 15; // Page size

    const [offset, setOffset] = useState(0);

    const query = useQuery({
        queryKey: ["prompt-search", q, offset, limit],
        queryFn: async () => await api.readPrompts(q, offset, limit),
        retry: true,
        staleTime: Infinity,
        placeholderData: (previousData) => previousData,
    });

    const prompts = query.data?.items || [];
    const total = query.data?.total || 0;
    const isFirstPage = offset === 0;
    const isLastPage = offset + limit >= total;

    const currentPage = useMemo(() => Math.floor(offset / limit) + 1, [offset, limit]);

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isFirstPage) setOffset((prev) => Math.max(0, prev - limit));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!isLastPage) setOffset((prev) => prev + limit);
    };

    const promptsRender = query.isSuccess
        ? prompts.map((prompt) => <SearchResult key={prompt.id} prompt={prompt} />)
        : null;

    const previousPagesRender = [];
    for (let i = currentPage - 1; i > 0 && i > currentPage - 3; i -= 1) {
        previousPagesRender.unshift(
            <PaginationItem key={i}>
                <PaginationLink onClick={() => setOffset((i - 1) * limit)}>{i}</PaginationLink>
            </PaginationItem>,
        );
    }

    const nextPagesRender = [];
    for (let i = currentPage + 1; i <= Math.ceil(total / limit) && i < currentPage + 3; i += 1) {
        nextPagesRender.push(
            <PaginationItem key={i}>
                <PaginationLink onClick={() => setOffset((i - 1) * limit)}>{i}</PaginationLink>
            </PaginationItem>,
        );
    }

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
            <Pagination className="mt-auto">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={handlePrev}
                            aria-disabled={isFirstPage}
                            className={isFirstPage ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                    {previousPagesRender}
                    <PaginationItem key={currentPage}>
                        <span className="text-muted-foreground px-4 text-sm">{currentPage}</span>
                    </PaginationItem>
                    {nextPagesRender}
                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={handleNext}
                            aria-disabled={isLastPage}
                            className={isLastPage ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
