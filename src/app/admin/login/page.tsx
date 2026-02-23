"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.push("/admin");
        }
    }, [isAuthenticated, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await login(username, password);

        if (result.success) {
            router.push("/admin");
        } else {
            setError(result.error || "Error al iniciar sesión");
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Logo & Branding */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img
                            src="/logos/ybvr_logo_light.png"
                            alt="YBVR"
                            className="h-8 w-auto"
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <span className="text-primary text-xs font-bold uppercase tracking-[0.3em]">
                            CMS Protegido
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Introduce tus credenciales para acceder al panel
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/20">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <User className="w-3 h-3" />
                                Usuario
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="admin"
                                autoComplete="username"
                                required
                                className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                                <Lock className="w-3 h-3" />
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    required
                                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !username || !password}
                            className="w-full bg-primary text-slate-950 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verificando...
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    Acceder al CMS
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-700 text-xs mt-8">
                    YBVR GUia CMS • Acceso restringido
                </p>
            </div>
        </div>
    );
}
