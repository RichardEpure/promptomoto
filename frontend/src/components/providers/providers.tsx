"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast, Toaster } from "sonner";
import { useTheme } from "next-themes";
import { AuthProvider } from "./auth";

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => {
            if (query.meta?.silent) {
                return;
            }
            console.error("Query error:", error);
            toast.error("Something went wrong");
        },
    }),
    mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.silent) {
                return;
            }
            console.error("Mutation error:", error);
            toast.error("Something went wrong");
        },
    }),
});

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
