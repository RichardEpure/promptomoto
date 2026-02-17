import { api } from "@/lib/api";
import { UserRole } from "@/lib/models/users";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PromptForm from "@/components/prompt/prompt-form";

export default async function EditPromptPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();

    const [prompt, user] = await Promise.all([
        api.readPrompt(id).catch(() => null),
        api.me({ Cookie: cookieStore.toString() }).catch(() => null),
    ]);

    if (!prompt) {
        return <div>Could not find prompt</div>;
    }

    if (!user || (user.id !== prompt.user_id && user.role !== UserRole.ADMIN)) {
        redirect(`/prompt/${prompt.id}`);
    }

    return <PromptForm prompt={prompt} />;
}
