"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Partners() {
    const [partnersList, setPartnersList] = useState<string[]>([]);
    const [config, setConfig] = useState({
        title: "Clientes",
        subtitle: "Nuestros Cimientos"
    });

    useEffect(() => {
        const fetchData = async () => {
            // Fetch partners
            const { data: partnersData } = await supabase
                .from("partners")
                .select("name")
                .order("created_at", { ascending: true });

            if (partnersData && partnersData.length > 0) {
                setPartnersList(partnersData.map(p => p.name));
            } else {
                setPartnersList(["Google", "Teknon", "B Braun", "Apple", "Zeiss", "Novartis", "Pfizer", "Bayer"]);
            }

            // Fetch config
            const { data: configData } = await supabase
                .from("site_config")
                .select("key, value")
                .in("key", ["partners.title", "partners.subtitle"]);

            if (configData) {
                const newConfig = { ...config };
                configData.forEach(item => {
                    if (item.key === "partners.title") newConfig.title = item.value;
                    if (item.key === "partners.subtitle") newConfig.subtitle = item.value;
                });
                setConfig(newConfig);
            }
        };

        fetchData();
    }, []);

    // Duplicate list for infinite scroll effect if needed
    const displayPartners = partnersList.length > 0 ? [...partnersList, ...partnersList, ...partnersList] : [];

    return (
        <section className="py-24 bg-background-dark border-y border-white/5 overflow-hidden">
            <div className="container-custom mb-16 text-center">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 block"
                >
                    {config.subtitle}
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-5xl sm:text-7xl font-black text-white outfit uppercase tracking-tighter"
                >
                    {config.title}
                </motion.h2>
            </div>

            <div className="relative group">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background-dark to-transparent z-10"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background-dark to-transparent z-10"></div>

                <div className="logo-scroll py-10">
                    <div className="flex items-center gap-24 px-12">
                        {displayPartners.map((name, idx) => (
                            <div
                                key={idx}
                                className="text-3xl sm:text-4xl font-black text-white/20 hover:text-white transition-all duration-500 uppercase tracking-widest outfit cursor-default whitespace-nowrap"
                            >
                                {name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
