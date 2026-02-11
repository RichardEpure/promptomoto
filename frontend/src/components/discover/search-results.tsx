"use client";

import { useSearchParams } from "next/navigation";

export function SearchResults() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q");

    return (
        <div className="mx-auto w-full max-w-5xl grow p-8">
            <div className="text-zinc-500 dark:text-zinc-400">
                {q ? (
                    <p>
                        Showing results for:{" "}
                        <span className="font-medium text-black dark:text-white">{q}</span>
                    </p>
                ) : (
                    <p>Start searching to discover prompts.</p>
                )}
            </div>
            {/* Results list will go here */}
        </div>
    );
}
