"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { AuthProvider } from "./auth";

const queryClient = new QueryClient();

function AppToaster() {
    const { theme } = useTheme();

    return <Toaster theme={theme as "light" | "dark" | "system"} richColors closeButton />;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <AuthProvider>{children}</AuthProvider>
                <AppToaster />
            </ThemeProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}
