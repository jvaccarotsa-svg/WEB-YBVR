'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('CLIENT ERROR DIAGNOSTIC:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-10 font-sans">
            <div className="max-w-2xl w-full">
                <h2 className="text-3xl font-black mb-6 text-primary outfit tracking-tighter uppercase">Error de Aplicación</h2>
                <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl mb-10">
                    <p className="text-slate-400 mb-4 font-light">Se ha detectado un error crítico en el cliente:</p>
                    <div className="bg-black/40 p-5 rounded-xl border border-red-500/20">
                        <p className="font-mono text-sm text-red-400 break-words">
                            {error.message || "Error desconocido durante la ejecución"}
                        </p>
                    </div>
                    {error.digest && (
                        <p className="mt-4 text-[10px] text-slate-600 font-mono uppercase tracking-widest">System Digest: {error.digest}</p>
                    )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="px-10 py-4 bg-primary text-slate-950 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,224,255,0.3)]"
                    >
                        Reintentar Carga
                    </button>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-10 py-4 bg-white/5 text-white border border-white/10 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        Ir al Inicio
                    </button>
                </div>
            </div>
        </div>
    );
}
