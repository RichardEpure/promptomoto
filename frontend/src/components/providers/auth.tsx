import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { UserPublic } from "@/lib/models/users";

interface AuthContext {
    user: UserPublic | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    logout: () => void;
    refetch: () => void;
}

const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const { data: user, isLoading } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => await api.me(),
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const logout = useCallback(async () => {
        await api.logout();
        queryClient.setQueryData(["auth"], null);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
    }, [queryClient]);

    const refetch = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ["auth"] });
    }, [queryClient]);

    return (
        <AuthContext
            value={{
                user: user ?? null,
                isLoading,
                isAuthenticated: !!user,
                logout,
                refetch,
            }}
        >
            {children}
        </AuthContext>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
