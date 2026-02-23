"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    username: string;
    display_name: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: async () => ({ success: false }),
    logout: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Verify existing session on mount
    useEffect(() => {
        const verifySession = async () => {
            const token = localStorage.getItem("cms_token");
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/admin/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    // Invalid/expired session
                    localStorage.removeItem("cms_token");
                    localStorage.removeItem("cms_user");
                }
            } catch {
                localStorage.removeItem("cms_token");
                localStorage.removeItem("cms_user");
            }

            setIsLoading(false);
        };

        verifySession();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                return { success: false, error: data.error || "Error al iniciar sesión" };
            }

            // Store session
            localStorage.setItem("cms_token", data.token);
            localStorage.setItem("cms_user", JSON.stringify(data.user));
            setUser(data.user);

            return { success: true };
        } catch {
            return { success: false, error: "Error de conexión" };
        }
    };

    const logout = async () => {
        const token = localStorage.getItem("cms_token");

        try {
            await fetch("/api/admin/logout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
        } catch {
            // Logout should always succeed client-side
        }

        localStorage.removeItem("cms_token");
        localStorage.removeItem("cms_user");
        setUser(null);
        router.push("/admin/login");
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
