import PromptForm from "@/components/prompt/prompt-form";
import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function NewPromptPage() {
    const cookieStore = await cookies();
    const user = await api.me({ Cookie: cookieStore.toString() }).catch(() => null);

    if (!user) {
        const target = "/prompt/new";
        const params = new URLSearchParams();
        params.set("redirect", target);
        redirect(`/login?${params.toString()}`);
    }

    return <PromptForm />;
}
