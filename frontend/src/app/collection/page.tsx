"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { Prompt } from "@/lib/models/prompts";
import { useAuth } from "@/components/providers/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogPopup,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 15;

export default function CollectionPage() {
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout>>();
    const [offset, setOffset] = useState(0);

    // Prompt pending deletion (drives the alert dialog)
    const [promptToDelete, setPromptToDelete] = useState<Prompt | null>(null);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceTimer) clearTimeout(debounceTimer);
        setDebounceTimer(
            setTimeout(() => {
                setDebouncedSearch(value);
                setOffset(0);
            }, 300),
        );
    };

    const query = useQuery({
        queryKey: ["collection", user?.id, debouncedSearch, offset, PAGE_SIZE],
        queryFn: () =>
            api.readPrompts({
                user_id: user!.id,
                search: debouncedSearch || undefined,
                offset,
                limit: PAGE_SIZE,
            }),
        enabled: isAuthenticated,
        placeholderData: (prev) => prev,
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.deletePrompt(id),
        onSuccess: () => {
            toast.success("Prompt deleted.");
            queryClient.invalidateQueries({ queryKey: ["collection"] });
            setPromptToDelete(null);
        },
    });

    const prompts = query.data?.items ?? [];
    const total = query.data?.total ?? 0;
    const isFirstPage = offset === 0;
    const isLastPage = offset + PAGE_SIZE >= total;
    const currentPage = useMemo(() => Math.floor(offset / PAGE_SIZE) + 1, [offset]);
    const totalPages = Math.ceil(total / PAGE_SIZE);

    const previousPages = [];
    for (let i = currentPage - 1; i > 0 && i > currentPage - 3; i -= 1) {
        previousPages.unshift(
            <PaginationItem key={i}>
                <PaginationLink onClick={() => setOffset((i - 1) * PAGE_SIZE)}>{i}</PaginationLink>
            </PaginationItem>,
        );
    }

    const nextPages = [];
    for (let i = currentPage + 1; i <= totalPages && i < currentPage + 3; i += 1) {
        nextPages.push(
            <PaginationItem key={i}>
                <PaginationLink onClick={() => setOffset((i - 1) * PAGE_SIZE)}>{i}</PaginationLink>
            </PaginationItem>,
        );
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Your Collection</h1>
                <Button asChild>
                    <Link href="/prompt/new">
                        <Plus className="mr-2 size-4" />
                        New Prompt
                    </Link>
                </Button>
            </div>
            <div className="relative mb-6">
                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search your prompts..."
                    className="pl-9"
                />
            </div>
            <div className="divide-border divide-y rounded-md border">
                {prompts.map((prompt) => (
                    <div
                        key={prompt.id}
                        className="flex items-center justify-between gap-4 px-4 py-3"
                    >
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{prompt.name}</p>
                            {prompt.short_description && (
                                <p className="text-muted-foreground truncate text-xs">
                                    {prompt.short_description}
                                </p>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="shrink-0">
                                    <MoreHorizontal className="size-4" />
                                    <span className="sr-only">Actions</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/prompt/${prompt.id}`}>
                                        <Eye className="mr-2 size-4" />
                                        View
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/prompt/${prompt.id}/edit`}>
                                        <Pencil className="mr-2 size-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    variant="destructive"
                                    onClick={() => setPromptToDelete(prompt)}
                                >
                                    <Trash2 className="mr-2 size-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}

                {prompts.length === 0 && query.isSuccess && (
                    <div className="px-4 py-12 text-center">
                        <p className="text-muted-foreground text-sm">
                            {debouncedSearch
                                ? "No prompts match your search."
                                : "You haven't created any prompts yet."}
                        </p>
                    </div>
                )}

                {query.isLoading && (
                    <div className="px-4 py-12 text-center">
                        <p className="text-muted-foreground text-sm">Loading...</p>
                    </div>
                )}
            </div>
            {totalPages > 1 && (
                <Pagination className="mt-6">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!isFirstPage)
                                        setOffset((prev) => Math.max(0, prev - PAGE_SIZE));
                                }}
                                aria-disabled={isFirstPage}
                                className={isFirstPage ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                        {previousPages}
                        <PaginationItem>
                            <span className="text-muted-foreground px-4 text-sm">
                                {currentPage}
                            </span>
                        </PaginationItem>
                        {nextPages}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (!isLastPage) setOffset((prev) => prev + PAGE_SIZE);
                                }}
                                aria-disabled={isLastPage}
                                className={isLastPage ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
            <AlertDialog
                open={!!promptToDelete}
                onOpenChange={(open) => {
                    if (!open) setPromptToDelete(null);
                }}
            >
                <AlertDialogPopup>
                    <AlertDialogTitle>Delete prompt</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete &quot;{promptToDelete?.name}&quot;? This
                        action cannot be undone.
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setPromptToDelete(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                                if (promptToDelete) deleteMutation.mutate(promptToDelete.id);
                            }}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogPopup>
            </AlertDialog>
        </>
    );
}
