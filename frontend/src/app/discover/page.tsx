import { Suspense } from "react";
import { SearchHeader } from "@/components/discover/search-header";
import { SearchResults } from "@/components/discover/search-results";

export default function DiscoverPage() {
    return (
        <main className="flex h-full flex-col font-sans">
            <Suspense fallback={<div className="h-18.25 border-b" />}>
                <SearchHeader />
            </Suspense>
            <Suspense fallback={<div className="p-8">Loading results...</div>}>
                <SearchResults />
            </Suspense>
        </main>
    );
}
