import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic';

// Initialize Supabase client safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create the client if we have the required environment variables
const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export async function GET() {
    if (!supabase) {
        console.error("Supabase environment variables are missing. Seeding skipped.");
        return NextResponse.json(
            { error: "Supabase environment variables are missing. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel." },
            { status: 500 }
        );
    }

    try {
        console.log("Starting database seeding...");

        // 1. Seed Site Config
        const siteConfigData = [
            // Global
            { key: "global.site_name", value: "YBVR GUia", section: "general", description: "Nombre del sitio" },
            // Hero
            { key: "hero.cta_primary", value: "Soluciones", section: "hero", description: "Texto botón primario" },
            { key: "hero.cta_secondary", value: "Sobre Nosotros", section: "hero", description: "Texto botón secundario" },
            { key: "hero.scroll_text", value: "Descubrir", section: "hero", description: "Texto scroll" },
            // Services
            { key: "services.title_main", value: "Servicios", section: "services", description: "Título principal" },
            { key: "services.title_highlight", value: "GUia", section: "services", description: "Palabra destacada título" },
            { key: "services.description", value: "Soluciones de ingeniería de datos y algoritmos avanzados diseñados para elevar la eficiencia operativa y el estándar de cuidado.", section: "services", description: "Descripción sección" },
            { key: "services.card_cta", value: "Explorar", section: "services", description: "Texto botón tarjeta" },
            // Partners
            { key: "partners.title", value: "Clientes", section: "partners", description: "Título sección" },
            { key: "partners.subtitle", value: "Nuestros Cimientos", section: "partners", description: "Subtítulo sección" },
            // Footer
            { key: "footer.description", value: "Liderando la convergencia entre la inteligencia artificial y la salud para crear un futuro extraordinario, eficiente y humano.", section: "footer", description: "Descripción empresa" },
            { key: "footer.col1_title", value: "Ingeniería", section: "footer", description: "Título Columna 1" },
            { key: "footer.col2_title", value: "Empresa", section: "footer", description: "Título Columna 2" },
            { key: "footer.col3_title", value: "Compliance", section: "footer", description: "Título Columna 3" },
            { key: "footer.tagline_1", value: "Designed for Excellence", section: "footer", description: "Tagline 1" },
            { key: "footer.tagline_2", value: "Madrid • Silicon Valley", section: "footer", description: "Tagline 2" },
            { key: "footer.copyright", value: "YBVR GUia • LÍDERES EN SALUD DIGITAL", section: "footer", description: "Texto Copyright" },

            // CTA Section
            { key: "cta.title_line1", value: "Impulsa el mañana", section: "cta", description: "Título Línea 1" },
            { key: "cta.title_line2", value: "de la", section: "cta", description: "Título Línea 2" },
            { key: "cta.title_highlight", value: "salud", section: "cta", description: "Palabra destacada" },
            { key: "cta.description", value: "Únete a los líderes globales que están transformando la atención médica con nuestras arquitecturas de inteligencia artificial.", section: "cta", description: "Descripción" },
            { key: "cta.btn_primary", value: "Solicitar Demo", section: "cta", description: "Botón Primario" },
            { key: "cta.btn_secondary", value: "Explorar Tech", section: "cta", description: "Botón Secundario" },

            // Header Section
            { key: "header.nav_services", value: "Servicios", section: "header", description: "Nav Servicios" },
            { key: "header.nav_tech", value: "Tecnología", section: "header", description: "Nav Tecnología" },
            { key: "header.nav_cases", value: "Casos de Éxito", section: "header", description: "Nav Casos" },
            { key: "header.nav_about", value: "Sobre Nosotros", section: "header", description: "Nav Nosotros" },
            { key: "header.btn_contact", value: "Contacto", section: "header", description: "Botón Contacto" },
            { key: "header.logo_text", value: "GUia", section: "header", description: "Texto Logo" },

            // Success Stories Section
            { key: "stories.title_part1", value: "Casos de", section: "stories", description: "Título Parte 1" },
            { key: "stories.title_highlight", value: "Éxito", section: "stories", description: "Palabra Destacada" },
            { key: "stories.description", value: "Transformación tecnológica real con impacto medible en la industria de la salud.", section: "stories", description: "Descripción" },
            { key: "stories.btn_video", value: "Ver Video", section: "stories", description: "Botón Video" },
            { key: "stories.btn_read_more", value: "Leer Más", section: "stories", description: "Botón Leer Más" }
        ];

        console.log("Seeding site_config...");
        for (const item of siteConfigData) {
            const { error } = await supabase.from("site_config").upsert(item, { onConflict: "key" });
            if (error) console.error(`Error inserting config ${item.key}:`, error);
        }

        // 2. Seed Services (if empty)
        const { count: servicesCount } = await supabase.from("services").select("*", { count: "exact", head: true });
        if (servicesCount === 0) {
            console.log("Seeding services...");
            const servicesData = [
                {
                    title: "Farmaco Vigilancia",
                    description: "Monitorización avanzada impulsada por GUia para cumplimiento normativo integral en tiempo real.",
                    icon_name: "Shield",
                    color: "from-blue-500/20 to-cyan-500/20",
                    order_index: 0
                },
                {
                    title: "Patient Pathway",
                    description: "Optimización de la ruta crítica del paciente mediante algoritmos predictivos de alta precisión.",
                    icon_name: "Smartphone",
                    color: "from-cyan-500/20 to-teal-500/20",
                    order_index: 1
                },
                {
                    title: "Congress GUia",
                    description: "Experiencias inmersivas para congresos médicos facilitando el aprendizaje colaborativo global.",
                    icon_name: "Globe",
                    color: "from-teal-500/20 to-emerald-500/20",
                    order_index: 2
                },
                {
                    title: "GUia-Learning",
                    description: "Formación de élite asistida por GUia para el perfeccionamiento continuo de profesionales del sector.",
                    icon_name: "BarChart3",
                    color: "from-emerald-500/20 to-blue-500/20",
                    order_index: 3
                }
            ];
            const { error } = await supabase.from("services").insert(servicesData);
            if (error) console.error("Error inserting services:", error);
        }

        // 3. Seed Partners (if empty)
        const { count: partnersCount } = await supabase.from("partners").select("*", { count: "exact", head: true });
        if (partnersCount === 0) {
            console.log("Seeding partners...");
            const partnersData = ["Google", "Teknon", "B Braun", "Apple", "Zeiss", "Novartis", "Pfizer", "Bayer"]
                .map(name => ({ name }));
            const { error } = await supabase.from("partners").insert(partnersData);
            if (error) console.error("Error inserting partners:", error);
        }

        // 4. Seed Success Stories (if empty)
        const { count: storiesCount } = await supabase.from("success_stories").select("*", { count: "exact", head: true });
        if (storiesCount === 0) {
            console.log("Seeding success stories...");
            const storiesData = [
                {
                    title: "Formación Galderma",
                    category: "Pharma Tech",
                    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLoAfmhoQ6uZ0mMG78dWF1fSiT_loTuZKWBKBVUYDXbHsrCu-yL0KOScxbsGet8HNV_LFfd362sME-KIWa8pzSRZQJ_erDvSix5jYkVm0_eYYZTriT5UC8eCMBI3xeKxrw45ApBprHZ8bXjXR92GfvDjl37ZJAXFXwFucekfV-dmXiG-eqUQhPpbW6vmdC9jRQJAASRW0P8TM5ecfrtzius3cDw45Mn37CbN_ry7MgCy053U9yWoTHe5sIZndHvuADO7log2qaFBg",
                    video_url: "#",
                    order_index: 0
                },
                {
                    title: "Vifor Insight",
                    category: "Data Analytics",
                    image_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuADHE0Xc7SP33n1Ew5QEbpAc8LUstLFfFFkr3OPAWB4p5RxuGvlAn-o-Rjovn288bJk9su1e5T_o1R5wXjfwNIWO7olO2O1V3GHMhPqM3nSK63ca60ufjGRxFlxNvOAqFYrNjbEnHbxGK6JFY6hh8NQ1mP8TDCYiitlVh9ydmLg2cyfsKKH25LHwBfG9JxGDudds6lPtFf_v-EW96NK5v19FUQxJeVhrqobHMzgg8zB5LkcB0jY4k5y_9OQMBDv4t_fZ5chiKJ6UOo",
                    video_url: "#",
                    order_index: 1
                }
            ];
            const { error } = await supabase.from("success_stories").insert(storiesData);
            if (error) console.error("Error inserting stories:", error);
        }

        return NextResponse.json({ message: "Seeding completed successfully" });
    } catch (error) {
        console.error("Seeding failed:", error);
        return NextResponse.json({ error: "Seeding failed", details: error }, { status: 500 });
    }
}
