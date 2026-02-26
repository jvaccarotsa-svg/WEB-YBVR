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
            subtitle: "Arquitectura de GUia para la excelencia operativa"
        },
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLoAfmhoQ6uZ0mMG78dWF1fSiT_loTuZKWBKBVUYDXbHsrCu-yL0KOScxbsGet8HNV_LFfd362sME-KIWa8pzSRZQJ_erDvSix5jYkVm0_eYYZTriT5UC8eCMBI3xeKxrw45ApBprHZ8bXjXR92GfvDjl37ZJAXFXwFucekfV-dmXiG-eqUQhPpbW6vmdC9jRQJAASRW0P8TM5ecfrtzius3cDw45Mn37CbN_ry7MgCy053U9yWoTHe5sIZndHvuADO7log2qaFBg",
            tag: "Interactive Visualization",
            title: "Impacto Visual",
            subtitle: "Soluciones inmersivas que transforman datos en decisiones"
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
                        subtitle: item.video_url || ""
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
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass mb-8 border-primary/20"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]">
                            {slides[currentSlide].tag}
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="inline-flex items-center justify-center lg:justify-start mb-12"
                    >
                        <div className="glass-capsule group relative flex items-center gap-6 px-8 py-4 rounded-[2rem] bg-white/[0.03] backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_20px_rgba(0,224,255,0.05)] hover:border-primary/30 transition-all duration-500">
                            {/* Inner Glow */}
                            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                            <img
                                src="/logos/ybvr_logo_light.png"
                                alt="YBVR Logo"
                                className="h-10 sm:h-12 w-auto object-contain opacity-90 group-hover:opacity-100 transition-all duration-300"
                            />

                            <div className="h-8 w-px bg-white/10 group-hover:bg-primary/20 transition-colors duration-500"></div>

                            <span className="font-black text-3xl sm:text-4xl lg:text-5xl outfit tracking-[-0.05em] leading-none group-hover:scale-[1.02] transition-transform duration-300">
                                <span className="text-white">GU</span>
                                <span className="text-primary italic lowercase">ia</span>
                            </span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-4xl sm:text-5xl lg:text-7xl font-black text-white outfit uppercase tracking-tighter leading-[0.9] mb-8 max-w-4xl mx-auto lg:mx-0"
                    >
                        {slides[currentSlide].title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-lg sm:text-xl lg:text-2xl text-slate-300 font-light mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed tracking-wide"
                    >
                        {slides[currentSlide].subtitle.includes(":") ? (
                            <>
                                {slides[currentSlide].subtitle.split(":")[0]}:
                                <span className="text-primary font-semibold ml-2 inline-block relative">
                                    {slides[currentSlide].subtitle.split(":")[1]}
                                    <span className="absolute -bottom-1 left-0 w-full h-px bg-primary/30"></span>
                                </span>
                            </>
                        ) : (
                            <span className="text-primary font-semibold border-b border-primary/20 pb-1">
                                {slides[currentSlide].subtitle}
                            </span>
                        )}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                    >
                        <button className="group bg-primary text-slate-950 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,224,255,0.2)] flex items-center justify-center gap-3">
                            {config.cta_primary}
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a
                            href="https://www.ybvr.com/about"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glass text-white px-12 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all border-white/20 inline-block text-center flex items-center justify-center hover:border-primary/30"
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
