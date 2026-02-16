import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

export default async function PromptPage({ params }: { params: Promise<{ id: string }> }) {
    let prompt;
    try {
        prompt = await api.readPrompt((await params).id);
    } catch {
        return <div>Could not find prompt</div>;
    }

    const tagsRender = prompt.tags.map((tag) => (
        <Badge key={tag} variant="secondary">
            {tag}
        </Badge>
    ));

    return (
        <main className="m-auto flex size-full max-w-5xl flex-col gap-5 px-8 py-5">
            <h2 className="text-2xl">{prompt.name}</h2>
            <div className="flex max-h-125 grow gap-5">
                <div className="h-full w-2/3 bg-zinc-700"></div>
                <div className="flex h-full w-1/3 flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm">Tags:</span>
                        {tagsRender}
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-xl">Description</h3>
                <div>{prompt.description}</div>
            </div>
        </main>
    );
}
