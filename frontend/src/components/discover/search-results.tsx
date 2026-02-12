"use client";

import { useSearchParams } from "next/navigation";
import { SearchResult } from "./search-result";

export function SearchResults() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");

    return (
        <div className="mx-auto w-full max-w-5xl grow p-8">
            <div className="mb-8 text-zinc-500 dark:text-zinc-400">
                {q ? (
                    <p>
                        Showing results for:{" "}
                        <span className="font-medium text-black dark:text-white">{q}</span>
                    </p>
                ) : (
                    <p>Start searching to discover prompts.</p>
                )}
            </div>
            <div className="grid grid-cols-3 gap-8">
                <SearchResult />
                <SearchResult />
                <SearchResult />
                <SearchResult />
                <SearchResult />
                <SearchResult />
            </div>
        </div>
    );
}
