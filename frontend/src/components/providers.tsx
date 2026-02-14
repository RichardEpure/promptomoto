"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

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
                {children}
                <AppToaster />
            </ThemeProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
}
