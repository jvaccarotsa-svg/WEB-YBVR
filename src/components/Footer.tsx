"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Linkedin, Twitter, Youtube, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const [config, setConfig] = useState({
        description: "Liderando la convergencia entre la inteligencia artificial y la salud para crear un futuro extraordinario, eficiente y humano.",
        col1_title: "Ingeniería",
        col2_title: "Empresa",
        col3_title: "Compliance",
        tagline_1: "Designed for Excellence",
        tagline_2: "Madrid • Silicon Valley",
        copyright: "YBVR GUia • LÍDERES EN SALUD DIGITAL"
    });

    useEffect(() => {
        const fetchConfig = async () => {
            const { data: configData } = await supabase
                .from("site_config")
                .select("key, value")
                .in("key", [
                    "footer.description",
                    "footer.col1_title",
                    "footer.col2_title",
                    "footer.col3_title",
                    "footer.tagline_1",
                    "footer.tagline_2",
                    "footer.copyright"
                ]);

            if (configData) {
                const newConfig = { ...config };
                configData.forEach(item => {
                    if (item.key === "footer.description") newConfig.description = item.value;
                    if (item.key === "footer.col1_title") newConfig.col1_title = item.value;
                    if (item.key === "footer.col2_title") newConfig.col2_title = item.value;
                    if (item.key === "footer.col3_title") newConfig.col3_title = item.value;
                    if (item.key === "footer.tagline_1") newConfig.tagline_1 = item.value;
                    if (item.key === "footer.tagline_2") newConfig.tagline_2 = item.value;
                    if (item.key === "footer.copyright") newConfig.copyright = item.value;
                });
                setConfig(newConfig);
            }
        };
        fetchConfig();
    }, []);

    return (
        <footer className="bg-black text-white pt-32 pb-12 px-6 border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32">
                    {/* Brand Info */}
                    <div className="lg:col-span-5 space-y-10">
                        <Link href="/" className="flex items-center gap-2 group">
                            <img
                                src="/logos/ybvr_logo_light.png"
                                alt="YBVR Logo"
                                className="h-10 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                            <span className="font-black text-lg tracking-[0.2em] outfit ml-2 mt-1">
                                <span className="text-white uppercase">GU</span>
                                <span className="text-primary italic lowercase">ia</span>
                            </span>
                        </Link>

                        <p className="text-lg text-slate-500 max-w-md leading-relaxed font-light">
                            {config.description}
                        </p>

                        <div className="flex gap-4">
                            {[Linkedin, Twitter, Youtube].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="w-14 h-14 rounded-2xl glass border-white/5 flex items-center justify-center hover:border-primary/50 hover:bg-primary/5 transition-all active:scale-90"
                                >
                                    <Icon className="w-6 h-6 text-white/50 group-hover:text-primary transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Nav Sections */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12 sm:gap-6">
                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">{config.col1_title}</h5>
                            <ul className="space-y-5">
                                {["Soluciones", "Tecnología VR", "Algoritmos GUia", "Propiedad Intelectual"].map(item => (
                                    <li key={item}>
                                        <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-2 group">
                                            {item.includes("GUia") ? (
                                                <>
                                                    {item.split("GUia")[0]}
                                                    <span className="text-white">GU</span>
                                                    <span className="text-primary italic lowercase">ia</span>
                                                    {item.split("GUia")[1]}
                                                </>
                                            ) : item}
                                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">{config.col2_title}</h5>
                            <ul className="space-y-5">
                                {["Nosotros", "Casos Reales", "Partners", "Contacto"].map(item => (
                                    <li key={item}>
                                        <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-8 col-span-2 sm:col-span-1">
                            <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4">{config.col3_title}</h5>
                            <ul className="space-y-5">
                                {["Privacidad", "Seguridad", "Ética GUia", "Legal"].map(item => (
                                    <li key={item}>
                                        <Link href="#" className="text-xs text-slate-500 hover:text-white transition-colors">
                                            {item.includes("GUia") ? (
                                                <>
                                                    {item.split("GUia")[0]}
                                                    <span className="text-white">GU</span>
                                                    <span className="text-primary italic lowercase">ia</span>
                                                    {item.split("GUia")[1]}
                                                </>
                                            ) : item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-12">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-1">
                            © {currentYear} {config.copyright.split("GUia")[0]}
                            <span className="text-white">GU</span>
                            <span className="text-primary italic lowercase">ia</span>
                            {config.copyright.split("GUia")[1]}
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        <span className="flex items-center gap-2">{config.tagline_1} <span className="w-1 h-1 bg-primary rounded-full"></span></span>
                        <span className="flex items-center gap-2">{config.tagline_2} <span className="w-1 h-1 bg-primary rounded-full"></span></span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
