"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
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
        <main className="mx-auto flex w-full max-w-3xl flex-col items-center px-16 py-32">
            <Field>
                <FieldLabel className="text-4xl" htmlFor="prompt-search">
                    Promptomoto
                </FieldLabel>
                <ButtonGroup>
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
            </Field>
        </main>
    );
}
