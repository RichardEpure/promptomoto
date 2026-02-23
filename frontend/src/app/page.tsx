"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/discover?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <main className="mx-auto flex w-full max-w-3xl grow flex-col items-center px-4 pt-[20vh] sm:px-16">
            <h1 className="text-4xl font-bold">Promptomoto</h1>
            <p className="text-muted-foreground mt-2 text-lg">Manage and share your AI prompts</p>
            <ButtonGroup className="mt-6 w-full max-w-xl">
                <Input
                    className="h-12 text-xl md:text-xl"
                    id="prompt-search"
                    placeholder="Search for a prompt"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                    className="h-12 px-8 text-xl"
                    variant="outline"
                    size="icon-lg"
                    onClick={handleSearch}
                >
                    <Search className="size-6" />
                </Button>
            </ButtonGroup>
            <Button asChild variant="secondary" className="mt-4">
                <Link href="/discover">Browse all prompts</Link>
            </Button>
        </main>
    );
}
