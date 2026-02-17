import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/copy-button";
import { api } from "@/lib/api";
import EditPromptButton from "@/components/prompt/edit-prompt-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Image as ImageIcon } from "lucide-react";

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
        <>
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">{prompt.name}</h1>
                <EditPromptButton prompt={prompt} />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-muted/30 flex size-full items-center justify-center">
                    <ImageIcon className="text-muted-foreground/20 h-16 w-16" />
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                        <CardDescription>{prompt.short_description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
                            <div className="flex flex-wrap gap-2">{tagsRender}</div>
                        </div>
                        <Separator />
                        <div>
                            <h4 className="mb-2 text-sm leading-none font-medium">Description</h4>
                            <p className="text-muted-foreground text-sm">{prompt.description}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-8">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Prompt</CardTitle>
                    <CopyButton text={prompt.content} />
                </CardHeader>
                <CardContent>
                    <ScrollArea className="bg-muted/50 h-100 w-full rounded-md border p-4">
                        <code className="font-mono text-sm whitespace-pre-wrap">
                            {prompt.content}
                        </code>
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    );
}
