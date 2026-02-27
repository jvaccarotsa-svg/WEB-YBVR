"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function Partners() {
    const [partnersList, setPartnersList] = useState<any[]>([]);
    const [config, setConfig] = useState({
        title: "Clientes",
        subtitle: "Nuestros Cimientos"
    });

    useEffect(() => {
        const fetchData = async () => {
            // Fetch partners
            const { data: partnersData } = await supabase
                .from("partners")
                .select("name, logo_url, website_url")
                .order("created_at", { ascending: true });

            if (partnersData && partnersData.length > 0) {
                setPartnersList(partnersData.map(p => ({
                    name: p.name,
                    logo: p.logo_url,
                    url: p.website_url
                })));
            } else {
                // Default fallback partners
                const defaults = ["Google", "Teknon", "B Braun", "Apple", "Zeiss", "Novartis", "Pfizer", "Bayer"];
                setPartnersList(defaults.map(name => ({ name, logo: null, url: null })));
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

    // For infinite scroll, we need enough items to fill the screen and overlap
    // If the list is very short (e.g. 1-2 items), we repeat it many times
    const duplicateCount = partnersList.length <= 2 ? 10 : (partnersList.length <= 5 ? 6 : 4);
    const displayPartners = partnersList.length > 0 ? Array(duplicateCount).fill(partnersList).flat() : [];

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

                <div className="logo-scroll items-center gap-24 px-12 py-10">
                    {displayPartners.map((partner, idx) => {
                        const content = (
                            <div className="flex flex-col items-center gap-2 group/logo">
                                {partner.logo ? (
                                    <div className="h-12 sm:h-16 w-auto flex items-center justify-center grayscale opacity-40 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition-all duration-500 transform group-hover/logo:scale-110">
                                        <img
                                            src={partner.logo}
                                            alt={partner.name}
                                            className="max-h-full w-auto object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-3xl sm:text-4xl font-black text-white/20 hover:text-white transition-all duration-500 uppercase tracking-widest outfit cursor-default whitespace-nowrap">
                                        {partner.name}
                                    </div>
                                )}
                            </div>
                        );

                        if (partner.url) {
                            return (
                                <a
                                    key={idx}
                                    href={partner.url.startsWith('http') ? partner.url : `https://${partner.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block transition-transform duration-300 hover:z-20 shrink-0"
                                >
                                    {content}
                                </a>
                            );
                        }

                        return <div key={idx} className="shrink-0">{content}</div>;
                    })}
                </div>
            </div>
        </section>
    );
}
