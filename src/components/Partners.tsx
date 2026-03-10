"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Partners() {
    const [partnersList, setPartnersList] = useState<any[]>([]);
    const [config, setConfig] = useState({
        title: "Clientes",
        subtitle: "Nuestros Cimientos"
    });
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState("");

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

    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return "";
        let videoId = "";

        if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
        }
        else if (url.includes("watch?v=")) {
            videoId = url.split("watch?v=")[1]?.split(/[&?#]/)[0];
        }
        else if (url.includes("embed/")) {
            videoId = url.split("embed/")[1]?.split(/[?#]/)[0];
        }
        else if (url.includes("/shorts/")) {
            videoId = url.split("/shorts/")[1]?.split(/[?#]/)[0];
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    };

    const isYoutubeUrl = (url: string) => {
        if (!url) return false;
        return url.includes("youtube.com") || url.includes("youtu.be");
    };

    const handlePartnerClick = (e: React.MouseEvent, url: string) => {
        if (isYoutubeUrl(url)) {
            e.preventDefault();
            setActiveVideo(getYoutubeEmbedUrl(url));
            setIsVideoOpen(true);
        }
    };

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
                        const isVideo = isYoutubeUrl(partner.url);

                        const content = (
                            <div className="flex flex-col items-center gap-2 group/logo relative">
                                {partner.logo ? (
                                    <div className="h-16 sm:h-20 w-40 sm:w-48 flex items-center justify-center grayscale-0 opacity-100 group-hover/logo:scale-110 group-hover/logo:brightness-125 transition-all duration-500 relative drop-shadow-xl">
                                        <img
                                            src={partner.logo}
                                            alt={partner.name}
                                            className="max-h-full w-auto object-contain"
                                        />
                                        {isVideo && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300">
                                                <div className="w-10 h-10 rounded-full glass border-primary/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,224,255,0.4)]">
                                                    <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="h-16 sm:h-20 w-40 sm:w-48 flex items-center justify-center text-2xl sm:text-3xl font-black text-white hover:text-primary transition-all duration-500 uppercase tracking-widest outfit cursor-default whitespace-nowrap group-hover/logo:scale-110">
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
                                    target={isVideo ? "_self" : "_blank"}
                                    rel="noopener noreferrer"
                                    className="block transition-transform duration-300 hover:z-20 shrink-0"
                                    onClick={(e) => handlePartnerClick(e, partner.url)}
                                >
                                    {content}
                                </a>
                            );
                        }

                        return <div key={idx} className="shrink-0">{content}</div>;
                    })}
                </div>
            </div>

            {/* Video Modal */}
            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10"
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <div className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,224,255,0.2)] border border-white/10" onClick={e => e.stopPropagation()}>
                            <button
                                className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:border-primary/50 group z-10"
                                onClick={() => setIsVideoOpen(false)}
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
                            </button>
                            <iframe
                                src={activeVideo}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
