"use client";

import { useState, useEffect } from "react";
import { Shield, Smartphone, Globe, BarChart3, ChevronRight, Activity, Zap, Server, Database, Code, Cpu, Link, Layers, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

// Map string names to Lucide components
const iconMap: any = {
    Shield, Smartphone, Globe, BarChart3, Activity, Zap, Server, Database, Code, Cpu, Link, Layers
};

export default function Services() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [config, setConfig] = useState({
        title_main: "Servicios",
        title_highlight: "GUia",
        description: "Soluciones de ingeniería de datos y algoritmos avanzados diseñados para elevar la eficiencia operativa y el estándar de cuidado.",
        card_cta: "Explorar"
    });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                // Fetch Section Config
                const { data: sectionData } = await supabase
                    .from("sections")
                    .select("*")
                    .eq("name", "services")
                    .single();

                if (sectionData) {
                    setConfig({
                        title_main: sectionData.title || "Servicios",
                        title_highlight: sectionData.subtitle || "GUia",
                        description: config.description,
                        card_cta: config.card_cta
                    });
                }

                const { data, error } = await supabase
                    .from("services")
                    .select("*")
                    .order("order_index", { ascending: true });

                console.log('DEBUG [Services.tsx] Data:', data);
                console.log('DEBUG [Services.tsx] Error:', error);

                if (data && data.length > 0) {
                    setServices(data);
                } else {
                    // Fallback to default static services if DB is empty
                    setServices([
                        {
                            title: "Farmaco Vigilancia",
                            description: "Monitorización avanzada impulsada por GUia para cumplimiento normativo integral en tiempo real.",
                            icon_name: "Shield",
                            color: "from-blue-500/20 to-cyan-500/20",
                            explorar_content: "Detalles completos sobre el sistema de Farmaco Vigilancia impulsado por GUia..."
                        },
                        {
                            title: "Patient Pathway",
                            description: "Optimización de la ruta crítica del paciente mediante algoritmos predictivos de alta precisión.",
                            icon_name: "Smartphone",
                            color: "from-cyan-500/20 to-teal-500/20",
                            explorar_content: "Detalles completos sobre Patient Pathway..."
                        },
                        {
                            title: "Congress GUia",
                            description: "Experiencias inmersivas para congresos médicos facilitando el aprendizaje colaborativo global.",
                            icon_name: "Globe",
                            color: "from-teal-500/20 to-emerald-500/20",
                            explorar_content: "Detalles completos sobre Congress GUia..."
                        },
                        {
                            title: "GUia-Learning",
                            description: "Formación de élite asistida por GUia para el perfeccionamiento continuo de profesionales del sector.",
                            icon_name: "BarChart3",
                            color: "from-emerald-500/20 to-blue-500/20",
                            explorar_content: "Detalles completos sobre GUia-Learning..."
                        }
                    ]);
                }

                // Fetch site config for Services
                const { data: configData } = await supabase
                    .from("site_config")
                    .select("key, value")
                    .in("key", ["services.title_main", "services.title_highlight", "services.description", "services.card_cta"]);

                if (configData) {
                    const newConfig = { ...config };
                    configData.forEach(item => {
                        if (item.key === "services.title_main") newConfig.title_main = item.value;
                        if (item.key === "services.title_highlight") newConfig.title_highlight = item.value;
                        if (item.key === "services.description") newConfig.description = item.value;
                        if (item.key === "services.card_cta") newConfig.card_cta = item.value;
                    });
                    setConfig(newConfig);
                }

            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const getIcon = (iconName: string) => {
        return iconMap[iconName] || Activity;
    };

    // Helper to generate a gradient based on index if not provided
    const getGradient = (index: number) => {
        const gradients = [
            "from-blue-500/20 to-cyan-500/20",
            "from-cyan-500/20 to-teal-500/20",
            "from-teal-500/20 to-emerald-500/20",
            "from-emerald-500/20 to-blue-500/20",
            "from-purple-500/20 to-pink-500/20",
            "from-orange-500/20 to-red-500/20"
        ];
        return gradients[index % gradients.length];
    };

    const openModal = (service: any) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    return (
        <section id="servicios" className="py-32 relative bg-background-dark overflow-hidden">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container-custom relative z-10">
                <div className="max-w-3xl mb-24 text-center lg:text-left mx-auto lg:mx-0">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-6xl font-black text-white mb-8 outfit uppercase tracking-tighter"
                    >
                        {config.title_main} <span className="text-primary italic">{config.title_highlight}</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 leading-relaxed font-light"
                    >
                        {config.description}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {services.map((service, idx) => {
                        const IconComponent = getIcon(service.icon_name);
                        const gradient = service.color || getGradient(idx);

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative bg-slate-900/40 border border-white/5 rounded-[2.5rem] p-10 glow-border overflow-hidden flex flex-col items-center lg:items-start text-center lg:text-left hover:bg-slate-900/60 transition-colors"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                <div className="relative z-10 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform overflow-hidden">
                                    {service.image_url ? (
                                        <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <IconComponent className="w-8 h-8" />
                                    )}
                                </div>

                                <h3 className="relative z-10 text-2xl font-bold text-white mb-4 outfit">{service.title}</h3>
                                <p className="relative z-10 text-slate-400 text-sm leading-relaxed mb-8 font-light">
                                    {service.desc || service.description}
                                </p>

                                <button
                                    onClick={() => openModal(service)}
                                    className="relative z-10 mt-auto text-primary text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group/btn"
                                >
                                    {config.card_cta} <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Modal Detail */}
            <AnimatePresence>
                {isModalOpen && selectedService && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-white/10 w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                            <button
                                className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors bg-white/5 p-2 rounded-xl border border-white/10 hover:border-primary/50"
                                onClick={() => setIsModalOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="p-12 sm:p-20">
                                <div className="flex flex-col md:flex-row gap-12 items-start">
                                    <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-[0_0_30px_rgba(0,224,255,0.2)]">
                                        {selectedService.image_url ? (
                                            <img src={selectedService.image_url} alt={selectedService.title} className="w-full h-full object-cover rounded-3xl" />
                                        ) : (
                                            (() => {
                                                const Icon = getIcon(selectedService.icon_name);
                                                return <Icon className="w-12 h-12" />;
                                            })()
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-4xl lg:text-6xl font-black text-white outfit uppercase mb-6 tracking-tighter">
                                            {selectedService.title}
                                        </h2>
                                        <div className="w-20 h-1 bg-primary mb-10 rounded-full opacity-50"></div>
                                        <div className="prose prose-invert max-w-none">
                                            <p className="text-xl text-slate-300 font-light leading-relaxed whitespace-pre-wrap">
                                                {selectedService.explorar_content || selectedService.description || selectedService.desc || "Explora las capacidades avanzadas de este servicio diseñado por GUia para revolucionar la atención médica."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
