"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api";
import { USER_CREATE, UserCreate } from "@/lib/models/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm, SubmitHandler } from "react-hook-form";

export default function SignupPage() {
    const router = useRouter();

    const form = useForm<UserCreate>({
        resolver: zodResolver(USER_CREATE.schema),
        defaultValues: USER_CREATE.defaultValues(),
    });

    const mutation = useMutation({
        mutationFn: api.createUser,
        onSuccess: () => {
            api.login({
                username: form.getValues("username"),
                password: form.getValues("password"),
            });
            router.push("/");
        },
        onError: (error: Error) => {
            if (!(error instanceof ApiError)) {
                return;
            }

            const details = error.detail;
            if (details.type !== "user_exists") {
                return;
            }

            if (details.username) {
                form.setError("username", {
                    type: "custom",
                    message: "Username is taken.",
                });
            }

            if (details.email) {
                form.setError("email", {
                    type: "custom",
                    message: "Email is taken.",
                });
            }
        },
    });

    const onSubmit: SubmitHandler<UserCreate> = (userCreate) => {
        mutation.mutate(userCreate);
    };

    return (
        <main className="flex grow flex-col items-center justify-center">
            <Card className="w-full sm:w-lg">
                <CardHeader>
                    <CardTitle>Signup</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="signup" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="username">Username</FieldLabel>
                                        <Input
                                            {...field}
                                            id="username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your username"
                                            autoComplete="off"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            type="email"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="example@email.com"
                                            autoComplete="email"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="password">Password</FieldLabel>
                                        <Input
                                            {...field}
                                            id="password"
                                            type="password"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Enter your password"
                                            autoComplete="new-password"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button type="submit" form="signup">
                            Submit
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </main>
    );
}
