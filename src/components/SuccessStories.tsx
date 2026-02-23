"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Play, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SuccessStories() {
    const [stories, setStories] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [activeVideo, setActiveVideo] = useState("");
    const [config, setConfig] = useState({
        title_part1: "Casos de",
        title_highlight: "Éxito",
        description: "Transformación tecnológica real con impacto medible en la industria de la salud.",
        btn_video: "Ver Video",
        btn_read_more: "Leer Más"
    });

    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch stories
            const { data, error } = await supabase
                .from("success_stories")
                .select("*")
                .order("order_index", { ascending: true });

            if (data && data.length > 0) {
                setStories(data);
            } else {
                // Fallback mock data
                setStories([
                    {
                        title: "Formación Galderma",
                        category: "Pharma Tech",
                        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLoAfmhoQ6uZ0mMG78dWF1fSiT_loTuZKWBKBVUYDXbHsrCu-yL0KOScxbsGet8HNV_LFfd362sME-KIWa8pzSRZQJ_erDvSix5jYkVm0_eYYZTriT5UC8eCMBI3xeKxrw45ApBprHZ8bXjXR92GfvDjl37ZJAXFXwFucekfV-dmXiG-eqUQhPpbW6vmdC9jRQJAASRW0P8TM5ecfrtzius3cDw45Mn37CbN_ry7MgCy053U9yWoTHe5sIZndHvuADO7log2qaFBg",
                        video_url: "#"
                    },
                    {
                        title: "Vifor Insight",
                        category: "Data Analytics",
                        image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuADHE0Xc7SP33n1Ew5QEbpAc8LUstLFfFFkr3OPAWB4p5RxuGvlAn-o-Rjovn288bJk9su1e5T_o1R5wXjfwNIWO7olO2O1V3GHMhPqM3nSK63ca60ufjGRxFlxNvOAqFYrNjbEnHbxGK6JFY6hh8NQ1mP8TDCYiitlVh9ydmLg2cyfsKKH25LHwBfG9JxGDudds6lPtFf_v-EW96NK5v19FUQxJeVhrqobHMzgg8zB5LkcB0jY4k5y_9OQMBDv4t_fZ5chiKJ6UOo",
                        video_url: "#"
                    }
                ]);
            }

            // Fetch config
            const { data: configData } = await supabase
                .from("site_config")
                .select("key, value")
                .in("key", [
                    "stories.title_part1",
                    "stories.title_highlight",
                    "stories.description",
                    "stories.btn_video",
                    "stories.btn_read_more"
                ]);

            if (configData) {
                const newConfig = { ...config };
                configData.forEach(item => {
                    if (item.key === "stories.title_part1") newConfig.title_part1 = item.value;
                    if (item.key === "stories.title_highlight") newConfig.title_highlight = item.value;
                    if (item.key === "stories.description") newConfig.description = item.value;
                    if (item.key === "stories.btn_video") newConfig.btn_video = item.value;
                    if (item.key === "stories.btn_read_more") newConfig.btn_read_more = item.value;
                });
                setConfig(newConfig);
            }
        };
        fetchData();
    }, []);

    const next = () => {
        if (stories.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % stories.length);
    };

    const prev = () => {
        if (stories.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
    };

    const getYoutubeEmbedUrl = (url: string) => {
        if (!url) return "";
        let videoId = "";

        // Handle youtu.be/VIDEO_ID
        if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1]?.split(/[?#]/)[0];
        }
        // Handle youtube.com/watch?v=VIDEO_ID
        else if (url.includes("watch?v=")) {
            videoId = url.split("watch?v=")[1]?.split(/[&?#]/)[0];
        }
        // Handle youtube.com/embed/VIDEO_ID
        else if (url.includes("embed/")) {
            videoId = url.split("embed/")[1]?.split(/[?#]/)[0];
        }
        // Handle shorts
        else if (url.includes("/shorts/")) {
            videoId = url.split("/shorts/")[1]?.split(/[?#]/)[0];
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
    };

    const openVideo = (url: string) => {
        if (!url || url === "#") return;
        setActiveVideo(getYoutubeEmbedUrl(url));
        setIsVideoOpen(true);
    };

    return (
        <section id="casos-de-exito" className="py-32 bg-slate-950/20 relative overflow-hidden">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-20 gap-10">
                    <div className="max-w-2xl text-center lg:text-left">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl sm:text-6xl font-black text-white mb-6 outfit tracking-tighter uppercase"
                        >
                            {config.title_part1} <span className="text-primary italic lowercase">{config.title_highlight}</span>
                        </motion.h2>
                        <p className="text-lg text-slate-400 font-light max-w-xl mx-auto lg:mx-0">
                            {config.description}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={prev}
                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-primary hover:text-primary transition-all active:scale-90"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={next}
                            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-primary hover:text-primary transition-all active:scale-90"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="relative h-[500px] w-full">
                    <AnimatePresence mode="wait">
                        {stories.length > 0 && (
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0 flex flex-col lg:flex-row gap-10 items-center"
                            >
                                <div className="relative w-full lg:w-3/5 h-[300px] lg:h-full rounded-[3rem] overflow-hidden group">
                                    <img
                                        src={stories[currentIndex].image_url}
                                        alt={stories[currentIndex].title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>

                                    {stories[currentIndex].video_url && stories[currentIndex].video_url !== "#" && (
                                        <button
                                            onClick={() => openVideo(stories[currentIndex].video_url)}
                                            className="absolute inset-0 flex items-center justify-center group"
                                        >
                                            <div className="w-20 h-20 rounded-full glass border-primary/40 flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-[0_0_30px_rgba(0,224,255,0.3)]">
                                                <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                                            </div>
                                        </button>
                                    )}
                                </div>

                                <div className="w-full lg:w-2/5 space-y-6 text-center lg:text-left">
                                    <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">
                                        {stories[currentIndex].category}
                                    </span>
                                    <h3 className="text-4xl lg:text-6xl font-black text-white outfit uppercase leading-none">
                                        {stories[currentIndex].title}
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed font-light">
                                        Explora cómo <span className="font-bold text-white">GU</span><span className="text-primary italic font-bold lowercase">ia</span> implementó soluciones avanzadas para optimizar procesos críticos en este proyecto.
                                    </p>

                                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                                        {stories[currentIndex].video_url && stories[currentIndex].video_url !== "#" && (
                                            <button
                                                onClick={() => openVideo(stories[currentIndex].video_url)}
                                                className="bg-primary text-slate-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3"
                                            >
                                                {config.btn_video} <Play className="w-4 h-4 fill-current" />
                                            </button>
                                        )}
                                        <a
                                            href={stories[currentIndex].link || "#"}
                                            className="glass text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3"
                                        >
                                            {config.btn_read_more} <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
                        <div className="relative w-full max-w-5xl aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,224,255,0.2)] border border-white/10">
                            <button
                                className="absolute top-6 left-6 flex items-center gap-2 text-white/50 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/10 hover:border-primary/50 group"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsVideoOpen(false);
                                }}
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
                            <button
                                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-xl border border-white/10 hover:border-primary/50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsVideoOpen(false);
                                }}
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
