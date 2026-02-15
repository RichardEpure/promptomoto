import { api } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function CollectionLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    try {
        const cookieStore = await cookies();
        await api.me({ Cookie: cookieStore.toString() });
    } catch {
        const target = "/collection";
        const params = new URLSearchParams();
        params.set("redirect", target);
        redirect(`/login?${params.toString()}`);
    }

    return children;
}
