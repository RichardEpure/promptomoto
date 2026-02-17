"use client";

import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Prompt, PromptCreate, PromptTag, PROMPT_CREATE, PromptUpdate } from "@/lib/models/prompts";
import { AiModel } from "@/lib/models/ai-models";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import { Image as ImageIcon } from "lucide-react";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxEmpty,
    ComboboxChips,
    ComboboxChip,
    ComboboxChipsInput,
    useComboboxAnchor,
} from "../ui/combobox";

type PromptFormMode = "create" | "edit";

interface PromptFormProps {
    // Pass an existing prompt to enter edit mode. Omit for create mode.
    prompt?: Prompt;
    // Called after a successful create or update. Receives the saved prompt.
    onSuccess?: (prompt: Prompt) => void;
}

export default function PromptForm({ prompt, onSuccess }: PromptFormProps) {
    const router = useRouter();
    const mode: PromptFormMode = prompt ? "edit" : "create";

    const form = useForm<PromptCreate>({
        resolver: zodResolver(PROMPT_CREATE.schema),
        defaultValues: prompt
            ? {
                  name: prompt.name,
                  short_description: prompt.short_description,
                  description: prompt.description,
                  content: prompt.content,
                  tags: prompt.tags,
                  ai_model_id: prompt.ai_model_id,
              }
            : PROMPT_CREATE.defaultValues(),
    });

    const aiModelsQuery = useQuery({
        queryKey: ["ai-models"],
        queryFn: api.readAiModels,
    });
    const aiModels: AiModel[] = aiModelsQuery.data ?? [];

    // Tags combobox anchor ref
    const tagsAnchorRef = useComboboxAnchor();

    const createMutation = useMutation({
        mutationFn: api.createPrompt,
        onSuccess: (saved) => {
            toast.success("Prompt created successfully.");
            if (onSuccess) {
                onSuccess(saved);
            } else {
                router.push(`/prompt/${saved.id}`);
            }
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: PromptUpdate) => api.updatePrompt(prompt!.id, data),
        onSuccess: (saved) => {
            toast.success("Prompt updated successfully.");
            if (onSuccess) {
                onSuccess(saved);
            } else {
                router.push(`/prompt/${saved.id}`);
            }
        },
    });

    const isPending = createMutation.isPending || updateMutation.isPending;

    const onSubmit: SubmitHandler<PromptCreate> = (data) => {
        if (mode === "edit") {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <form id="prompt-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-8 flex justify-between">
                <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="flex-1">
                            <Input
                                {...field}
                                id="name"
                                aria-invalid={fieldState.invalid}
                                placeholder="Enter a name for your prompt"
                                autoComplete="off"
                                className="font-bold tracking-tight"
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <div className="ml-4 flex shrink-0 gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={isPending}
                    >
                        Reset
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending
                            ? mode === "edit"
                                ? "Saving..."
                                : "Creating..."
                            : mode === "edit"
                              ? "Save Changes"
                              : "Create Prompt"}
                    </Button>
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-muted/30 flex size-full items-center justify-center">
                    <ImageIcon className="text-muted-foreground/20 h-16 w-16" />
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                        <Controller
                            name="short_description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Input
                                        {...field}
                                        id="short_description"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="A brief summary"
                                        autoComplete="off"
                                        className="text-muted-foreground text-sm"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Controller
                            name="tags"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div>
                                    <h4 className="mb-4 text-sm leading-none font-medium">Tags</h4>
                                    <Combobox
                                        multiple
                                        value={field.value ?? []}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                        }}
                                        items={Object.values(PromptTag)}
                                    >
                                        <ComboboxChips ref={tagsAnchorRef}>
                                            {(field.value ?? []).map((tag) => (
                                                <ComboboxChip key={tag}>{tag}</ComboboxChip>
                                            ))}
                                            <ComboboxChipsInput placeholder="Select tags..." />
                                        </ComboboxChips>
                                        <ComboboxContent anchor={tagsAnchorRef}>
                                            <ComboboxList>
                                                {Object.values(PromptTag).map((tag) => (
                                                    <ComboboxItem key={tag} value={tag}>
                                                        {tag}
                                                    </ComboboxItem>
                                                ))}
                                            </ComboboxList>
                                            <ComboboxEmpty>No tags found.</ComboboxEmpty>
                                        </ComboboxContent>
                                    </Combobox>
                                    {fieldState.invalid && (
                                        <FieldError className="mt-2" errors={[fieldState.error]} />
                                    )}
                                </div>
                            )}
                        />
                        <Separator />
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div>
                                    <h4 className="mb-2 text-sm leading-none font-medium">
                                        Description
                                    </h4>
                                    <Textarea
                                        {...field}
                                        id="description"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Describe your prompt in detail"
                                        rows={4}
                                        className="text-muted-foreground text-sm"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError className="mt-1" errors={[fieldState.error]} />
                                    )}
                                </div>
                            )}
                        />
                        <Separator />
                        <Controller
                            name="ai_model_id"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <div>
                                    <h4 className="mb-2 text-sm leading-none font-medium">
                                        AI Model
                                    </h4>
                                    <Combobox
                                        value={field.value}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                        }}
                                        itemToStringLabel={(id) =>
                                            aiModels.find((m) => m.id === id)?.name ?? id
                                        }
                                        items={aiModels}
                                    >
                                        <ComboboxInput
                                            placeholder={
                                                aiModelsQuery.isLoading
                                                    ? "Loading models..."
                                                    : "Select an AI model"
                                            }
                                            disabled={aiModelsQuery.isLoading}
                                            showClear
                                        />
                                        <ComboboxContent>
                                            <ComboboxEmpty>No models found.</ComboboxEmpty>
                                            <ComboboxList>
                                                {aiModels.map((model) => (
                                                    <ComboboxItem key={model.id} value={model.id}>
                                                        <span>{model.name}</span>
                                                        <span className="text-muted-foreground text-xs">
                                                            {model.provider}
                                                        </span>
                                                    </ComboboxItem>
                                                ))}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    {fieldState.invalid && (
                                        <FieldError className="mt-1" errors={[fieldState.error]} />
                                    )}
                                </div>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-8">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>Prompt</CardTitle>
                </CardHeader>
                <CardContent>
                    <Controller
                        name="content"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Textarea
                                    {...field}
                                    id="content"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="Enter the prompt content"
                                    rows={12}
                                    className="bg-muted/50 h-100 font-mono text-sm"
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </CardContent>
            </Card>
        </form>
    );
}
