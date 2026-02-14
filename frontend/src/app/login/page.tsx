"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api";
import { USER_LOGIN, UserLogin } from "@/lib/models/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm, SubmitHandler } from "react-hook-form";

export default function LoginPage() {
    const form = useForm<UserLogin>({
        resolver: zodResolver(USER_LOGIN.schema),
        defaultValues: USER_LOGIN.defaultValues(),
    });

    const mutation = useMutation({
        mutationFn: api.login,
        onSuccess: (user) => {
            console.log("Logged in successfully:", user);
        },
        onError: (error: Error) => {
            if (!(error instanceof ApiError)) {
                return;
            }

            if (error.status === 401) {
                form.setError("password", {
                    type: "custom",
                    message: "Invalid username or password.",
                });
            }
        },
    });

    const onSubmit: SubmitHandler<UserLogin> = (userLogin) => {
        mutation.mutate(userLogin);
    };

    return (
        <main className="flex grow flex-col items-center justify-center">
            <Card className="w-full sm:w-lg">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form id="login" onSubmit={form.handleSubmit(onSubmit)}>
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
                        <Button type="submit" form="login">
                            Submit
                        </Button>
                    </Field>
                </CardFooter>
            </Card>
        </main>
    );
}
