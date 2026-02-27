"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Hero() {
    const defaultSlides = [
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA7dXpDnrfa-UMICT3dOP03-28V5jaEoqrbViwcjwYyjHom6BMB7ja-3pCBYpZSNVSixj9dMRSbndQcv9qqoOy_HGHwILf7n2KmIKqWhcQdMosBriEWr6Jflw39hoMijdIV2oNOSVvC6FBWZh-ziKpsmt96o2TTllSWg3eLa02_CWSq5NZw-Oe46PVq-CJEFyGesBP_QRxJzb-GNVvyhAov2h3Pd5qBI5dlgUqGLDEKer2Kmcg06rIxvDbQ18gEWHHjHPEG9gU5zc",
            tag: "Deep Tech & Healthcare",
            title: "Optimización Crítica",
            subtitle: "Arquitectura de GUia para la excelencia operativa",
            showText: true
        },
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLoAfmhoQ6uZ0mMG78dWF1fSiT_loTuZKWBKBVUYDXbHsrCu-yL0KOScxbsGet8HNV_LFfd362sME-KIWa8pzSRZQJ_erDvSix5jYkVm0_eYYZTriT5UC8eCMBI3xeKxrw45ApBprHZ8bXjXR92GfvDjl37ZJAXFXwFucekfV-dmXiG-eqUQhPpbW6vmdC9jRQJAASRW0P8TM5ecfrtzius3cDw45Mn37CbN_ry7MgCy053U9yWoTHe5sIZndHvuADO7log2qaFBg",
            tag: "Interactive Visualization",
            title: "Impacto Visual",
            subtitle: "Soluciones inmersivas que transforman datos en decisiones",
            showText: true
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState(defaultSlides);
    const [config, setConfig] = useState({
        cta_primary: "Soluciones",
        cta_secondary: "Sobre Nosotros",
        scroll_text: "Descubrir"
    });

    useEffect(() => {
        const fetchSlides = async () => {
            const { data: sectionData, error: sectionError } = await supabase
                .from("sections")
                .select("id")
                .eq("name", "hero")
                .single();

            console.log('DEBUG [Hero.tsx] Section Data:', { data: sectionData, error: sectionError });

            if (sectionData) {
                const { data: carouselData } = await supabase
                    .from("carousel_items")
                    .select("*")
                    .eq("section_id", sectionData.id)
                    .order("order_index", { ascending: true });

                if (carouselData && carouselData.length > 0) {
                    setSlides(carouselData.map(item => ({
                        image: item.image_url,
                        tag: item.alt_text || "YBVR GUia",
                        title: item.title || "Innovación",
                        subtitle: item.video_url || "",
                        showText: item.show_text !== false
                    })));
                }
            }

            // Fetch site config for Hero
            const { data: configData } = await supabase
                .from("site_config")
                .select("key, value")
                .in("key", ["hero.cta_primary", "hero.cta_secondary", "hero.scroll_text"]);

            if (configData) {
                const newConfig = { ...config };
                configData.forEach(item => {
                    if (item.key === "hero.cta_primary") newConfig.cta_primary = item.value;
                    if (item.key === "hero.cta_secondary") newConfig.cta_secondary = item.value;
                    if (item.key === "hero.scroll_text") newConfig.scroll_text = item.value;
                });
                setConfig(newConfig);
            }
        };

        fetchSlides();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => setCurrentSlide((s) => (s + 1) % slides.length), 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <header className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background-dark">
            <div className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="w-full h-full relative"
                    >
                        <img
                            src={slides[currentSlide].image}
                            alt="Hero Background"
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-background-dark"></div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center lg:text-left">
                <div className="max-w-4xl">
                    {/* 1. Integrated Branding & Tag Header */}
                    {slides[currentSlide].showText !== false && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="flex flex-col gap-6 mb-10 items-center lg:items-start"
                        >
                            {/* Unified Branding Capsule */}
                            <div className="flex items-center gap-8 px-10 py-4 rounded-3xl bg-white/[0.02] backdrop-blur-3xl border border-white/5 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-700">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                <img src="/logos/ybvr_logo_light.png" alt="YBVR" className="h-6 sm:h-7 opacity-80 group-hover:opacity-100 transition-opacity" />

                                <div className="w-px h-6 bg-white/10"></div>

                                <span className="text-white font-bold tracking-[0.25em] text-xl sm:text-2xl flex items-center gap-1.5 outfit uppercase">
                                    GU
                                    <span className="relative flex items-center">
                                        I
                                        <span className="absolute -top-1 left-1/2 -track-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_10px_#00E0FF]"></span>
                                    </span>
                                    A
                                </span>
                            </div>

                            {/* Slim Marketing Tag */}
                            <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#00E0FF]"></span>
                                <span className="text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.4em] outfit">
                                    {slides[currentSlide].tag}
                                </span>
                            </div>
                        </motion.div>
                    )}




                    {/* 2. Main Title in Glassmorphism Frame */}
                    {slides[currentSlide].showText !== false && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4, duration: 1 }}
                            className="relative mb-10 group"
                        >
                            <div className="absolute -inset-1 bg-primary/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative px-6 sm:px-10 py-6 rounded-[2.5rem] bg-white/[0.01] backdrop-blur-xl border border-white/10 shadow-3xl">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight outfit uppercase tracking-[0.15em] leading-[1.1] text-white">
                                    {slides[currentSlide].title.split(" ").map((word, idx) => (
                                        <span key={idx} className={idx === 0 || word.includes("IA") || word.includes("CRÍTICA") || idx > 3 ? "text-primary font-normal" : "text-white/90"}>
                                            {word}{" "}
                                        </span>
                                    ))}
                                </h1>
                            </div>
                        </motion.div>
                    )}

                    {slides[currentSlide].showText !== false && (
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="text-lg sm:text-xl lg:text-2xl text-slate-300 font-light mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed tracking-wide outfit"
                        >
                            {slides[currentSlide].subtitle}
                        </motion.p>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start"
                    >
                        <button className="group relative bg-primary text-slate-950 px-14 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.05] active:scale-95 transition-all shadow-[0_0_40px_rgba(0,224,255,0.3)] flex items-center justify-center gap-4 overflow-hidden">
                            <span className="relative z-10 flex items-center gap-2">
                                {config.cta_primary}
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                        </button>

                        <a
                            href="https://www.ybvr.com/about"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group px-14 py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] bg-slate-950/40 backdrop-blur-md border border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center"
                        >
                            {config.cta_secondary}
                        </a>
                    </motion.div>
                </div>
            </div >


            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50 cursor-pointer hover:opacity-100 transition-opacity"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white">{config.scroll_text}</span>
                <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
            </motion.div>
        </header >
    );
}
