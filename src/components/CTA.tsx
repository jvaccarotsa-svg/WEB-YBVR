"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function CTA() {
    const [config, setConfig] = useState({
        title_line1: "Impulsa el mañana",
        title_line2: "de la",
        title_highlight: "salud",
        description: "Únete a los líderes globales que están transformando la atención médica con nuestras arquitecturas de inteligencia artificial.",
        btn_primary: "Solicitar Demo",
        btn_secondary: "Explorar Tech"
    });

    useEffect(() => {
        const fetchConfig = async () => {
            const { data: configData } = await supabase
                .from("site_config")
                .select("key, value")
                .in("key", [
                    "cta.title_line1",
                    "cta.title_line2",
                    "cta.title_highlight",
                    "cta.description",
                    "cta.btn_primary",
                    "cta.btn_secondary"
                ]);

            if (configData) {
                const newConfig = { ...config };
                configData.forEach(item => {
                    if (item.key === "cta.title_line1") newConfig.title_line1 = item.value;
                    if (item.key === "cta.title_line2") newConfig.title_line2 = item.value;
                    if (item.key === "cta.title_highlight") newConfig.title_highlight = item.value;
                    if (item.key === "cta.description") newConfig.description = item.value;
                    if (item.key === "cta.btn_primary") newConfig.btn_primary = item.value;
                    if (item.key === "cta.btn_secondary") newConfig.btn_secondary = item.value;
                });
                setConfig(newConfig);
            }
        };
        fetchConfig();
    }, []);

    return (
        <section className="py-32 px-6 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="w-full max-w-6xl glass rounded-[4rem] p-12 sm:p-24 text-center relative z-10 overflow-hidden group"
            >
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white mb-10 outfit tracking-tighter uppercase leading-none">
                    {config.title_line1} <br /> {config.title_line2} <span className="text-primary italic">{config.title_highlight}</span>
                </h2>

                <p className="text-xl sm:text-2xl text-slate-400 mb-14 max-w-3xl mx-auto font-light leading-relaxed">
                    {config.description}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button className="bg-primary text-slate-950 px-16 py-6 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(0,224,255,0.4)] flex items-center justify-center gap-3">
                        {config.btn_primary} <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="glass text-white px-16 py-6 rounded-[2rem] font-bold uppercase tracking-widest text-sm hover:bg-white/10 active:scale-95 transition-all border-white/20">
                        {config.btn_secondary}
                    </button>
                </div>
            </motion.div>
        </section >
    );
}
