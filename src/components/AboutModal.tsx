"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Globe, Cpu, PlayCircle } from "lucide-react";

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
    const techPillars = [
        {
            icon: Zap,
            title: "Ultra Low Latency",
            desc: "Optimización extremo a extremo para streaming en tiempo real sin retrasos."
        },
        {
            icon: Globe,
            title: "Inmersión 8K",
            desc: "Calidad visual superior que transporta al espectador al centro de la acción."
        },
        {
            icon: Cpu,
            title: "FOV Optimization",
            desc: "Tecnología patentada que optimiza el ancho de banda según el campo de visión."
        },
        {
            icon: PlayCircle,
            title: "Multi-View Social",
            desc: "Cambio instantáneo de cámaras y experiencias sociales compartidas."
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-slate-900/90 border border-white/10 w-full max-w-5xl rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,224,255,0.15)] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Gradient Border Top */}
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/50 hover:text-white transition-all bg-white/5 p-2 rounded-xl border border-white/10 hover:border-primary/50 group z-20"
                            onClick={onClose}
                        >
                            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        <div className="p-8 md:p-16 lg:p-20 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-start overflow-y-auto max-h-[90vh]">
                            {/* Left Content: Branding & Mission */}
                            <div className="w-full lg:w-2/5 text-center lg:text-left">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-8 flex justify-center lg:justify-start"
                                >
                                    <img
                                        src="/logos/ybvr_logo_light.png"
                                        alt="YBVR Logo"
                                        className="h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(0,224,255,0.3)]"
                                    />
                                </motion.div>

                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-3xl md:text-5xl font-black text-white outfit uppercase mb-6 tracking-tighter leading-none"
                                >
                                    Elevando el <span className="text-primary italic">Estándar</span> del Streaming
                                </motion.h2>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg text-slate-400 font-light leading-relaxed mb-10"
                                >
                                    YBVR desafía los límites de lo posible, transformando transmisiones de eventos en vivo en experiencias sociales e inmersivas en 8K. Nuestra tecnología conecta a los fans con sus pasiones, sin importar la distancia o el ancho de banda.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="inline-block p-1 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-primary/20"
                                >
                                    <div className="bg-slate-950/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/5 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                            <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-[0_0_10px_#00e0ff]"></div>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Estado del Sistema</div>
                                            <div className="text-sm font-bold text-white tracking-wide">Optimización GUia Activa</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Content: Tech Pillars Grid */}
                            <div className="w-full lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {techPillars.map((pillar, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        className="group p-8 rounded-[2rem] bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 hover:border-primary/30 transition-all duration-500 flex flex-col items-center sm:items-start text-center sm:text-left"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-slate-950 transition-all duration-300">
                                            <pillar.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3 outfit uppercase tracking-wide">{pillar.title}</h3>
                                        <p className="text-sm text-slate-400 font-light leading-relaxed">
                                            {pillar.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Accent */}
                        <div className="absolute bottom-0 right-0 p-10 opacity-10 pointer-events-none hidden lg:block">
                            <span className="text-8xl font-black outfit text-white tracking-tighter uppercase">YBVR</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
