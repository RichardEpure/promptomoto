"use client";

import { useSearchParams } from "next/navigation";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";

export function SearchHeader() {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || "";

    return (
        <div className="sticky top-0 w-full border-b px-4 py-3">
            <Form action="/discover" className="mx-auto flex max-w-5xl items-center gap-4">
                <Field orientation="horizontal">
                    <FieldLabel
                        className="mr-4 flex-none! text-xl font-bold"
                        htmlFor="prompt-search"
                    >
                        Promptomoto
                    </FieldLabel>
                    <ButtonGroup className="w-full max-w-xl">
                        <Input
                            id="prompt-search"
                            name="q"
                            placeholder="Search for a prompt"
                            defaultValue={q}
                            key={q}
                            className="border-none ring-offset-0 focus-visible:ring-1"
                        />
                        <Button type="submit" variant="ghost" size="icon">
                            <Search className="size-4" />
                        </Button>
                    </ButtonGroup>
                </Field>
            </Form>
        </div>
    );
}
