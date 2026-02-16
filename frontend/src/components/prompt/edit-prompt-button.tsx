"use client";

import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "../providers/auth";
import { useMemo } from "react";
import { Prompt } from "@/lib/models/prompts";
import Link from "next/link";

export default function EditPromptButton({ prompt }: { prompt: Prompt }) {
    const { user, isAuthenticated, isAdmin } = useAuth();

    const canEdit = useMemo(() => {
        return isAdmin || (isAuthenticated && user?.id === prompt.user_id);
    }, [isAdmin, isAuthenticated, prompt.user_id, user?.id]);

    return (
        <Button asChild variant="outline" size="icon" className={canEdit ? "" : "hidden"}>
            <Link href={`/prompt/${prompt.id}/edit`}>
                <Pencil />
            </Link>
        </Button>
    );
}
