"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    Image as ImageIcon,
    Settings,
    Users,
    Briefcase,
    LogOut,
    ChevronRight,
    Plus,
    Trash2,
    Save,
    Loader2,
    Video,
    RefreshCw
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminDashboard() {
    const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("hero");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Status message for feedback
    const [status, setStatus] = useState({ type: "", message: "" });

    // Hero Data State
    const [heroSection, setHeroSection] = useState({ id: "", title: "", subtitle: "" });
    const [carouselItems, setCarouselItems] = useState<any[]>([]);

    // Success Stories Data State
    const [successStories, setSuccessStories] = useState<any[]>([]);

    // Services Data State
    const [servicesSection, setServicesSection] = useState({ id: "", title: "", subtitle: "" });
    const [services, setServices] = useState<any[]>([]);

    // Partners Data State
    const [partners, setPartners] = useState<any[]>([]);

    // Config Data State
    const [config, setConfig] = useState<any[]>([]);

    const menuItems = [
        { id: "hero", label: "Hero & Carousel", icon: ImageIcon },
        { id: "stories", label: "Casos de Éxito", icon: LayoutDashboard },
        { id: "services", label: "Servicios", icon: Briefcase },
        { id: "partners", label: "Clientes", icon: Users },
        { id: "config", label: "Configuración", icon: Settings },
    ];

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    // Auth guard
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/admin/login");
        }
    }, [authLoading, isAuthenticated, router]);

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "hero") {
                const { data: section } = await supabase.from("sections").select("*").eq("name", "hero").single();
                if (section) {
                    setHeroSection(section);
                    const { data: items } = await supabase
                        .from("carousel_items")
                        .select("*")
                        .eq("section_id", section.id)
                        .order("order_index", { ascending: true });
                    setCarouselItems(items || []);
                } else {
                    console.log("Hero section not found in DB");
                }
            } else if (activeTab === "stories") {
                const { data } = await supabase
                    .from("success_stories")
                    .select("*")
                    .order("order_index", { ascending: true });
                setSuccessStories(data || []);
            } else if (activeTab === "services") {
                const { data: section } = await supabase.from("sections").select("*").eq("name", "services").single();
                if (section) setServicesSection(section);

                const { data } = await supabase
                    .from("services")
                    .select("*")
                    .order("order_index", { ascending: true });
                setServices(data || []);
            } else if (activeTab === "partners") {
                const { data } = await supabase
                    .from("partners")
                    .select("*")
                    .order("created_at", { ascending: true });
                setPartners(data || []);
            } else if (activeTab === "config") {
                const { data } = await supabase
                    .from("site_config")
                    .select("*")
                    .order("section", { ascending: true });
                setConfig(data || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    const handleSaveHero = async () => {
        setSaving(true);
        setStatus({ type: "info", message: "Guardando Hero..." });
        try {
            console.log('DEBUG [handleSaveHero] Starting save with state:', { heroSection, carouselItems });

            // 1. Upsert the hero section
            const { data: section, error: sectionError } = await supabase
                .from("sections")
                .upsert(
                    { name: "hero", title: heroSection.title, subtitle: heroSection.subtitle },
                    { onConflict: 'name' }
                )
                .select()
                .single();

            if (sectionError) {
                console.error('DEBUG [handleSaveHero] Section Upsert Error:', sectionError);
                throw sectionError;
            }
            if (!section) throw new Error("No se pudo crear o encontrar la sección Hero en la base de datos.");

            const sectionId = section.id;
            console.log('DEBUG [handleSaveHero] Section ID:', sectionId);

            // 2. Clear old items
            const { error: deleteError } = await supabase
                .from("carousel_items")
                .delete()
                .eq("section_id", sectionId);

            if (deleteError) {
                console.error('DEBUG [handleSaveHero] Carousel Delete Error:', deleteError);
                throw deleteError;
            }

            // 3. Insert new items
            if (carouselItems.length > 0) {
                const itemsToInsert = carouselItems.map((item, index) => ({
                    section_id: sectionId,
                    image_url: item.image_url || "https://placeholder.com", // Fallback if empty
                    title: item.title,
                    alt_text: item.alt_text,
                    video_url: item.video_url,
                    order_index: index
                }));
                const { error: carouselError } = await supabase.from("carousel_items").insert(itemsToInsert);
                if (carouselError) {
                    console.error('DEBUG [handleSaveHero] Carousel Insert Error:', carouselError);
                    throw carouselError;
                }
            }

            setStatus({ type: "success", message: "Hero guardado correctamente" });
            fetchData();
        } catch (error: any) {
            console.error('DEBUG [handleSaveHero] Final Catch:', error);
            setStatus({
                type: "error",
                message: `Error de base de datos: ${error.message || error.code || "Error desconocido"}. Revisa si aplicaste el script SQL de políticas RLS.`
            });
        }
        setSaving(false);
        setTimeout(() => setStatus({ type: "", message: "" }), 7000);
    };

    const handleSaveStories = async () => {
        setSaving(true);
        try {
            const { error: deleteError } = await supabase.from("success_stories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
            if (deleteError) throw deleteError;

            if (successStories.length > 0) {
                const itemsToInsert = successStories.map((item, index) => ({
                    title: item.title,
                    category: item.category,
                    image_url: item.image_url,
                    video_url: item.video_url,
                    link: item.link,
                    order_index: index
                }));
                const { error: insertError } = await supabase.from("success_stories").insert(itemsToInsert);
                if (insertError) throw insertError;
            }
            setStatus({ type: "success", message: "Casos de éxito guardados" });
        } catch (error: any) {
            console.error(error);
            setStatus({ type: "error", message: `Error: ${error.message || "Error al guardar historias"}` });
        }
        setSaving(false);
        setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    };

    const handleSaveServices = async () => {
        setSaving(true);
        try {
            // 1. Upsert the services section
            const { data: section, error: sectionError } = await supabase
                .from("sections")
                .upsert(
                    { name: "services", title: servicesSection.title, subtitle: servicesSection.subtitle },
                    { onConflict: 'name' }
                )
                .select()
                .single();

            if (sectionError) throw sectionError;

            // 2. Clear and insert items
            const { error: deleteError } = await supabase.from("services").delete().neq("id", -1);
            if (deleteError) throw deleteError;

            if (services.length > 0) {
                const itemsToInsert = services.map((item, index) => ({
                    title: item.title,
                    description: item.description,
                    icon_name: item.icon_name,
                    image_url: item.image_url,
                    link: item.link,
                    order_index: index
                }));
                const { error: insertError } = await supabase.from("services").insert(itemsToInsert);
                if (insertError) throw insertError;
            }
            setStatus({ type: "success", message: "Servicios guardados" });
            fetchData();
        } catch (error: any) {
            console.error(error);
            setStatus({ type: "error", message: `Error: ${error.message || "Error al guardar servicios"}` });
        }
        setSaving(false);
        setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    };

    const handleSavePartners = async () => {
        setSaving(true);
        try {
            const { error: deleteError } = await supabase.from("partners").delete().neq("id", "00000000-0000-0000-0000-000000000000");
            if (deleteError) throw deleteError;

            if (partners.length > 0) {
                const itemsToInsert = partners.map((item) => ({
                    name: item.name,
                    logo_url: item.logo_url,
                    website_url: item.website_url
                }));
                const { error: insertError } = await supabase.from("partners").insert(itemsToInsert);
                if (insertError) throw insertError;
            }
            setStatus({ type: "success", message: "Clientes guardados" });
        } catch (error: any) {
            console.error(error);
            setStatus({ type: "error", message: `Error: ${error.message || "Error al guardar clientes"}` });
        }
        setSaving(false);
        setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    };

    const handleSaveConfig = async () => {
        setSaving(true);
        try {
            if (config.length > 0) {
                for (const item of config) {
                    const { error: updateError } = await supabase
                        .from("site_config")
                        .update({ value: item.value })
                        .eq("key", item.key);

                    if (updateError) throw updateError;
                }
            }
            setStatus({ type: "success", message: "Configuración guardada" });
        } catch (error: any) {
            console.error(error);
            setStatus({ type: "error", message: `Error: ${error.message || "Error al guardar configuración"}` });
        }
        setSaving(false);
        setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    };

    const loadDefaultHero = () => {
        const defaultSlides = [
            {
                image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA7dXpDnrfa-UMICT3dOP03-28V5jaEoqrbViwcjwYyjHom6BMB7ja-3pCBYpZSNVSixj9dMRSbndQcv9qqoOy_HGHwILf7n2KmIKqWhcQdMosBriEWr6Jflw39hoMijdIV2oNOSVvC6FBWZh-ziKpsmt96o2TTllSWg3eLa02_CWSq5NZw-Oe46PVq-CJEFyGesBP_QRxJzb-GNVvyhAov2h3Pd5qBI5dlgUqGLDEKer2Kmcg06rIxvDbQ18gEWHHjHPEG9gU5zc",
                alt_text: "Deep Tech & Healthcare",
                title: "Optimización Crítica",
                video_url: "Arquitectura de GUia para la excelencia operativa"
            },
            {
                image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLoAfmhoQ6uZ0mMG78dWF1fSiT_loTuZKWBKBVUYDXbHsrCu-yL0KOScxbsGet8HNV_LFfd362sME-KIWa8pzSRZQJ_erDvSix5jYkVm0_eYYZTriT5UC8eCMBI3xeKxrw45ApBprHZ8bXjXR92GfvDjl37ZJAXFXwFucekfV-dmXiG-eqUQhPpbW6vmdC9jRQJAASRW0P8TM5ecfrtzius3cDw45Mn37CbN_ry7MgCy053U9yWoTHe5sIZndHvuADO7log2qaFBg",
                alt_text: "Interactive Visualization",
                title: "Impacto Visual",
                video_url: "Soluciones inmersivas que transforman datos en decisiones"
            }
        ];
        setCarouselItems(defaultSlides);
        if (!heroSection.title) setHeroSection({ ...heroSection, title: "YBVR GUia", subtitle: "Innovación" });
    };

    const loadDefaultStories = () => {
        setSuccessStories([
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
    };

    const loadDefaultServices = () => {
        setServices([
            {
                title: "Farmaco Vigilancia",
                description: "Monitorización avanzada impulsada por GUia para cumplimiento normativo integral en tiempo real.",
                icon_name: "Shield",
            },
            {
                title: "Patient Pathway",
                description: "Optimización de la ruta crítica del paciente mediante algoritmos predictivos de alta precisión.",
                icon_name: "Smartphone",
            },
            {
                title: "Congress GUia",
                description: "Experiencias inmersivas para congresos médicos facilitando el aprendizaje colaborativo global.",
                icon_name: "Globe",
            },
            {
                title: "GUia-Learning",
                description: "Formación de élite asistida por GUia para el perfeccionamiento continuo de profesionales del sector.",
                icon_name: "BarChart3",
            }
        ]);
    };

    const loadDefaultPartners = () => {
        setPartners(["Google", "Teknon", "B Braun", "Apple", "Zeiss", "Novartis", "Pfizer", "Bayer"].map(name => ({ name, logo_url: "", website_url: "" })));
    };

    const addCarouselItem = () => setCarouselItems([...carouselItems, { image_url: "", title: "", alt_text: "" }]);
    const removeCarouselItem = (index: number) => setCarouselItems(carouselItems.filter((_, i) => i !== index));

    const addStory = () => setSuccessStories([...successStories, { title: "Nuevo Caso", category: "Pharma", image_url: "", video_url: "" }]);
    const removeStory = (index: number) => setSuccessStories(successStories.filter((_, i) => i !== index));

    const addService = () => setServices([...services, { title: "Nuevo Servicio", description: "", icon_name: "Activity", image_url: "" }]);
    const removeService = (index: number) => setServices(services.filter((_, i) => i !== index));

    const addPartner = () => setPartners([...partners, { name: "Nuevo Cliente", logo_url: "", website_url: "" }]);
    const removePartner = (index: number) => setPartners(partners.filter((_, i) => i !== index));


    const getSaveFunction = () => {
        switch (activeTab) {
            case "hero": return handleSaveHero;
            case "stories": return handleSaveStories;
            case "services": return handleSaveServices;
            case "partners": return handleSavePartners;
            case "config": return handleSaveConfig;
            default: return undefined;
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-800 flex flex-col pt-8">
                <div className="px-8 mb-12">
                    <div className="flex items-center gap-3 outfit font-bold text-2xl text-white">
                        <img src="/logos/ybvr_logo_light.png" alt="YBVR" className="h-6 w-auto" />
                        <span className="text-primary italic text-xs mt-2 uppercase tracking-widest">GUia CMS</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-slate-400 hover:text-white hover:bg-slate-900"
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{item.label}</span>
                            {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    {user && (
                        <p className="px-4 mb-2 text-xs text-slate-600 truncate">{user.display_name || user.username}</p>
                    )}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto">
                <header className="flex justify-between items-end mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-white outfit uppercase">
                            {menuItems.find(i => i.id === activeTab)?.label}
                        </h1>
                        <p className="text-slate-400 mt-2">Gestiona {menuItems.find(i => i.id === activeTab)?.label.toLowerCase()} de tu sitio web.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {status.message && (
                            <span className={`text-sm font-medium ${status.type === "success" ? "text-green-400" : "text-red-400"}`}>
                                {status.message}
                            </span>
                        )}
                        <button
                            onClick={getSaveFunction()}
                            disabled={saving}
                            className="bg-primary text-slate-950 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Publicar Cambios
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 backdrop-blur-sm">

                        {/* HERO TAB */}
                        {activeTab === "hero" && (
                            <div className="space-y-8">
                                <div className="flex justify-end">
                                    <button
                                        onClick={loadDefaultHero}
                                        className="text-primary hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/10"
                                    >
                                        <RefreshCw className="w-3 h-3" /> Cargar Defaults
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Título Global Section</label>
                                        <input
                                            type="text"
                                            value={heroSection.title || ""}
                                            onChange={(e) => setHeroSection({ ...heroSection, title: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Subtítulo Global Section</label>
                                        <input
                                            type="text"
                                            value={heroSection.subtitle || ""}
                                            onChange={(e) => setHeroSection({ ...heroSection, subtitle: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-800">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-lg font-bold text-white outfit">Slides del Carousel</h3>
                                        <button
                                            onClick={addCarouselItem}
                                            className="text-primary border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary/10 transition-all"
                                        >
                                            <Plus className="w-3 h-3" /> Añadir Slide
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {carouselItems.map((item, i) => (
                                            <div key={i} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative group border-t-2 border-t-primary/20">
                                                <button
                                                    onClick={() => removeCarouselItem(i)}
                                                    className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors z-10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="flex flex-col gap-6">
                                                    <div className="w-full">
                                                        <ImageUpload
                                                            value={item.image_url}
                                                            onChange={(url) => {
                                                                const newItems = [...carouselItems];
                                                                newItems[i].image_url = url;
                                                                setCarouselItems(newItems);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="w-full space-y-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Título (Impacto Visual...)"
                                                            value={item.title || ""}
                                                            onChange={(e) => {
                                                                const newItems = [...carouselItems];
                                                                newItems[i].title = e.target.value;
                                                                setCarouselItems(newItems);
                                                            }}
                                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Tag (PharmaTech...)"
                                                            value={item.alt_text || ""}
                                                            onChange={(e) => {
                                                                const newItems = [...carouselItems];
                                                                newItems[i].alt_text = e.target.value;
                                                                setCarouselItems(newItems);
                                                            }}
                                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Descripción / Subtítulo"
                                                            value={item.video_url || ""}
                                                            onChange={(e) => {
                                                                const newItems = [...carouselItems];
                                                                newItems[i].video_url = e.target.value;
                                                                setCarouselItems(newItems);
                                                            }}
                                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STORIES TAB */}
                        {activeTab === "stories" && (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white outfit">Carrusel de Casos de Éxito</h3>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={loadDefaultStories}
                                            className="text-primary hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/10"
                                        >
                                            <RefreshCw className="w-3 h-3" /> Cargar Defaults
                                        </button>
                                        <button
                                            onClick={addStory}
                                            className="text-primary border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary/10 transition-all"
                                        >
                                            <Plus className="w-3 h-3" /> Añadir Caso
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {successStories.map((story, i) => (
                                        <div key={i} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start relative group hover:border-primary/20 transition-all">
                                            <div className="w-full md:w-32 flex-shrink-0">
                                                <ImageUpload
                                                    value={story.image_url}
                                                    onChange={(url) => {
                                                        const n = [...successStories]; n[i].image_url = url; setSuccessStories(n);
                                                    }}
                                                    className="w-full h-24"
                                                />
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-600 uppercase">Título</label>
                                                    <input
                                                        type="text"
                                                        value={story.title || ""}
                                                        onChange={(e) => {
                                                            const n = [...successStories]; n[i].title = e.target.value; setSuccessStories(n);
                                                        }}
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:border-primary outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-600 uppercase">Categoría</label>
                                                    <input
                                                        type="text"
                                                        value={story.category || ""}
                                                        onChange={(e) => {
                                                            const n = [...successStories]; n[i].category = e.target.value; setSuccessStories(n);
                                                        }}
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:border-primary outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-slate-600 uppercase">Link Video (Opcional)</label>
                                                    <div className="relative">
                                                        <Video className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                                                        <input
                                                            type="text"
                                                            value={story.video_url || ""}
                                                            onChange={(e) => {
                                                                const n = [...successStories]; n[i].video_url = e.target.value; setSuccessStories(n);
                                                            }}
                                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 text-xs focus:border-primary outline-none"
                                                            placeholder="YouTube URL..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeStory(i)}
                                                className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SERVICES TAB */}
                        {activeTab === "services" && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Título Sección</label>
                                        <input
                                            type="text"
                                            value={servicesSection.title || ""}
                                            onChange={(e) => setServicesSection({ ...servicesSection, title: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Resaltado (GUia/Web...)</label>
                                        <input
                                            type="text"
                                            value={servicesSection.subtitle || ""}
                                            onChange={(e) => setServicesSection({ ...servicesSection, subtitle: e.target.value })}
                                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-6 pt-8 border-t border-slate-800">
                                    <h3 className="text-lg font-bold text-white outfit">Listado de Servicios</h3>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={loadDefaultServices}
                                            className="text-primary hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/10"
                                        >
                                            <RefreshCw className="w-3 h-3" /> Cargar Defaults
                                        </button>
                                        <button
                                            onClick={addService}
                                            className="text-primary border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary/10 transition-all"
                                        >
                                            <Plus className="w-3 h-3" /> Añadir Servicio
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-6">
                                    {services.map((service, i) => (
                                        <div key={i} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative group">
                                            <button
                                                onClick={() => removeService(i)}
                                                className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="space-y-4">
                                                {/* Image/Icon Upload */}
                                                <div className="w-full flex items-center justify-center bg-slate-900 rounded-xl p-4 border border-slate-800">
                                                    <div className="w-16 h-16">
                                                        <ImageUpload
                                                            value={service.image_url}
                                                            onChange={(url) => {
                                                                const n = [...services]; n[i].image_url = url; setServices(n);
                                                            }}
                                                            className="w-full h-full rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">O usar Icono Lucide</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: Shield, Globe..."
                                                            value={service.icon_name || ""}
                                                            onChange={(e) => {
                                                                const n = [...services]; n[i].icon_name = e.target.value; setServices(n);
                                                            }}
                                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-600 uppercase">Título</label>
                                                        <input
                                                            type="text"
                                                            value={service.title || ""}
                                                            onChange={(e) => {
                                                                const n = [...services]; n[i].title = e.target.value; setServices(n);
                                                            }}
                                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción</label>
                                                <textarea
                                                    value={service.description || ""}
                                                    onChange={(e) => {
                                                        const n = [...services]; n[i].description = e.target.value; setServices(n);
                                                    }}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:border-primary outline-none min-h-[80px]"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PARTNERS TAB */}
                        {activeTab === "partners" && (
                            <div className="space-y-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-white outfit">Clientes / Partners</h3>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={loadDefaultPartners}
                                            className="text-primary hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/10"
                                        >
                                            <RefreshCw className="w-3 h-3" /> Cargar Defaults
                                        </button>
                                        <button
                                            onClick={addPartner}
                                            className="text-primary border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-primary/10 transition-all"
                                        >
                                            <Plus className="w-3 h-3" /> Añadir Cliente
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {partners.map((partner, i) => (
                                        <div key={i} className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative group flex flex-col items-center text-center">
                                            <button
                                                onClick={() => removePartner(i)}
                                                className="absolute top-2 right-2 text-slate-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="w-full aspect-video mb-4">
                                                <ImageUpload
                                                    value={partner.logo_url}
                                                    onChange={(url) => {
                                                        const n = [...partners]; n[i].logo_url = url; setPartners(n);
                                                    }}
                                                    className="w-full h-full"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Nombre Cliente"
                                                value={partner.name || ""}
                                                onChange={(e) => {
                                                    const n = [...partners]; n[i].name = e.target.value; setPartners(n);
                                                }}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:border-primary outline-none mb-2 text-center"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Website URL"
                                                value={partner.website_url || ""}
                                                onChange={(e) => {
                                                    const n = [...partners]; n[i].website_url = e.target.value; setPartners(n);
                                                }}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-[10px] focus:border-primary outline-none text-center text-slate-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CONFIG TAB */}
                        {activeTab === "config" && (
                            <div className="space-y-8">
                                {/* Group by section */}
                                {(Object.entries(config.reduce((acc, item) => {
                                    (acc[item.section] = acc[item.section] || []).push(item);
                                    return acc;
                                }, {} as Record<string, any[]>)) as [string, any[]][]).map(([section, items]) => (
                                    <div key={section} className="space-y-6 mb-8">
                                        <h3 className="text-xl font-bold text-white outfit uppercase border-b border-primary/20 pb-2 mb-4">
                                            Sección: {section}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {items.map((item: any) => (
                                                <div key={item.key} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                                                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">
                                                        {item.description || item.key}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={item.value || ""}
                                                        onChange={(e) => {
                                                            const newConfig = config.map(c =>
                                                                c.key === item.key ? { ...c, value: e.target.value } : c
                                                            );
                                                            setConfig(newConfig);
                                                        }}
                                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:border-primary outline-none"
                                                    />
                                                    <p className="text-[10px] text-slate-600 mt-1 font-mono">{item.key}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {config.length === 0 && (
                                    <div className="text-center py-20 text-slate-500">
                                        <p>No hay configuraciones disponibles. Asegúrate de ejecutar el script SQL.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
