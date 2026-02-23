"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { supabase } from "@/lib/supabase";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [config, setConfig] = useState({
        nav_services: "Servicios",
        nav_tech: "Tecnología",
        nav_cases: "Casos de Éxito",
        nav_about: "Sobre Nosotros",
        btn_contact: "Contacto",
        logo_text: "GUia"
    });

    useEffect(() => {
        const fetchConfig = async () => {
            const { data: configData } = await supabase
                .from("site_config")
                .select("key, value")
                .in("key", [
                    "header.nav_services",
                    "header.nav_tech",
                    "header.nav_cases",
                    "header.nav_about",
                    "header.btn_contact",
                    "header.logo_text"
                ]);

            if (configData) {
                const newConfig = { ...config };
                configData.forEach((item: { key: string; value: string }) => {
                    if (item.key === "header.nav_services") newConfig.nav_services = item.value;
                    if (item.key === "header.nav_tech") newConfig.nav_tech = item.value;
                    if (item.key === "header.nav_cases") newConfig.nav_cases = item.value;
                    if (item.key === "header.nav_about") newConfig.nav_about = item.value;
                    if (item.key === "header.btn_contact") newConfig.btn_contact = item.value;
                    if (item.key === "header.logo_text") newConfig.logo_text = item.value;
                });
                setConfig(newConfig);
            }
        };
        fetchConfig();
    }, []);

    const navLinks = [
        { label: config.nav_services, href: "#servicios" },
        { label: config.nav_tech, href: "#tecnologia" },
        { label: config.nav_cases, href: "#casos-de-exito" },
        { label: config.nav_about, href: "#sobre-nosotros" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 sm:px-6 ${scrolled ? "py-3" : "py-6"}`}>
            <div className={`max-w-7xl mx-auto glass rounded-2xl transition-all duration-500 ${scrolled ? "bg-card-dark/90 shadow-2xl" : "bg-card-dark/40"}`}>
                <div className="px-6 sm:px-8 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img
                            src="/logos/ybvr_logo_light.png"
                            alt="YBVR Logo"
                            className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                        <span className="font-black text-xs sm:text-sm tracking-widest outfit ml-1 mt-1">
                            <span className="text-white uppercase">GU</span>
                            <span className="text-primary italic lowercase">ia</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 hover:text-primary transition-all hover:tracking-[0.3em]"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="hidden sm:block bg-primary text-slate-950 px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,224,255,0.3)]">
                            {config.btn_contact}
                        </button>
                        <button
                            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-96 border-t border-white/5" : "max-h-0"}`}>
                    <div className="px-8 py-6 flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-xs font-bold uppercase tracking-widest text-white/70 hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button className="sm:hidden w-full bg-primary text-slate-950 py-4 rounded-xl font-bold text-xs uppercase tracking-widest">
                            Contacto
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
