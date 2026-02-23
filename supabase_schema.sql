-- Create site_config table for global texts
CREATE TABLE IF NOT EXISTS public.site_config (
    key TEXT PRIMARY KEY,
    value TEXT,
    section TEXT, -- 'hero', 'services', 'partners', 'footer', 'general'
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Sections Table RLS
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access sections" ON public.sections;
DROP POLICY IF EXISTS "Allow all access sections" ON public.sections;
CREATE POLICY "Allow all access sections" ON public.sections FOR ALL USING (true) WITH CHECK (true);

-- Carousel Items RLS
ALTER TABLE public.carousel_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access carousel_items" ON public.carousel_items;
DROP POLICY IF EXISTS "Allow all access carousel_items" ON public.carousel_items;
CREATE POLICY "Allow all access carousel_items" ON public.carousel_items FOR ALL USING (true) WITH CHECK (true);

-- Success Stories RLS
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access success_stories" ON public.success_stories;
DROP POLICY IF EXISTS "Allow all access success_stories" ON public.success_stories;
CREATE POLICY "Allow all access success_stories" ON public.success_stories FOR ALL USING (true) WITH CHECK (true);

-- Services RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access services" ON public.services;
DROP POLICY IF EXISTS "Allow all access services" ON public.services;
CREATE POLICY "Allow all access services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- Site Config RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access site_config" ON public.site_config;
DROP POLICY IF EXISTS "Allow all access site_config" ON public.site_config;
CREATE POLICY "Allow all access site_config" ON public.site_config FOR ALL USING (true) WITH CHECK (true);

-- Partners RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access partners" ON public.partners;
CREATE POLICY "Allow all access partners" ON public.partners FOR ALL USING (true) WITH CHECK (true);

-- Insert initial data (Hardcoded content migration)
INSERT INTO public.site_config (key, value, section, description) VALUES
-- Hero Section
('hero.cta_primary', 'Soluciones', 'hero', 'Texto del botón principal'),
('hero.cta_secondary', 'Sobre Nosotros', 'hero', 'Texto del botón secundario'),
('hero.scroll_text', 'Descubrir', 'hero', 'Texto del indicador de scroll'),

-- Header Section
('header.nav_services', 'Servicios', 'header', 'Label for Services navigation link'),
('header.nav_tech', 'Tecnología', 'header', 'Label for Technology navigation link'),
('header.nav_cases', 'Casos de Éxito', 'header', 'Label for Success Stories navigation link'),
('header.nav_about', 'Sobre Nosotros', 'header', 'Label for About Us navigation link'),
('header.btn_contact', 'Contacto', 'header', 'Label for Contact button'),
('header.logo_text', 'GUia', 'header', 'Text next to the logo'),

-- CTA Section
('cta.title_line1', 'Impulsa el mañana', 'cta', 'First line of CTA title'),
('cta.title_line2', 'de la', 'cta', 'Second line of CTA title'),
('cta.title_highlight', 'salud', 'cta', 'Highlighted text in CTA title'),
('cta.description', 'Únete a los líderes globales que están transformando la atención médica con nuestras arquitecturas de inteligencia artificial.', 'cta', 'CTA description text'),
('cta.btn_primary', 'Solicitar Demo', 'cta', 'Primary button text'),
('cta.btn_secondary', 'Explorar Tech', 'cta', 'Secondary button text'),

-- Success Stories Section
('stories.title_part1', 'Casos de', 'stories', 'First part of Success Stories title'),
('stories.title_highlight', 'Éxito', 'stories', 'Highlighted part of Success Stories title'),
('stories.description', 'Transformación tecnológica real con impacto medible en la industria de la salud.', 'stories', 'Description for Success Stories section'),
('stories.btn_video', 'Ver Video', 'stories', 'Text for video button'),
('stories.btn_read_more', 'Leer Más', 'stories', 'Text for read more button'),

-- Services Section
('services.title_main', 'Servicios', 'services', 'Título principal'),
('services.title_highlight', 'GUia', 'services', 'Parte destacada del título'),
('services.description', 'Soluciones de ingeniería de datos y algoritmos avanzados diseñados para elevar la eficiencia operativa y el estándar de cuidado.', 'services', 'Descripción de la sección'),
('services.card_cta', 'Explorar', 'services', 'Texto del botón en tarjetas'),

-- Partners Section
('partners.subtitle', 'Nuestros Cimientos', 'partners', 'Subtítulo pequeño'),
('partners.title', 'Clientes', 'partners', 'Título principal'),

-- Footer Section
('footer.description', 'Liderando la convergencia entre la inteligencia artificial y la salud para crear un futuro extraordinario, eficiente y humano.', 'footer', 'Descripción de la empresa'),
('footer.col1_title', 'Ingeniería', 'footer', 'Título columna 1'),
('footer.col2_title', 'Empresa', 'footer', 'Título columna 2'),
('footer.col3_title', 'Compliance', 'footer', 'Título columna 3'),
('footer.tagline_1', 'Designed for Excellence', 'footer', 'Frase final 1'),
('footer.tagline_2', 'Madrid • Silicon Valley', 'footer', 'Frase final 2'),
('footer.copyright', 'YBVR GUia • LÍDERES EN SALUD DIGITAL', 'footer', 'Texto copyright (sin año)')
ON CONFLICT (key) DO NOTHING;

-- Ensure partners table exists (if not already created by previous setup)
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for partners
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access partners" ON public.partners;
DROP POLICY IF EXISTS "Allow authenticated full access partners" ON public.partners;
DROP POLICY IF EXISTS "Allow anonymous full access partners" ON public.partners;

CREATE POLICY "Allow public read access partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Allow anonymous full access partners" ON public.partners FOR ALL USING (true) WITH CHECK (true);

-- Missing Tables and Policies for CMS

-- Sections Table
CREATE TABLE IF NOT EXISTS public.sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    title TEXT,
    subtitle TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access sections" ON public.sections;
DROP POLICY IF EXISTS "Allow authenticated full access sections" ON public.sections;
DROP POLICY IF EXISTS "Allow anonymous full access sections" ON public.sections;

CREATE POLICY "Allow public read access sections" ON public.sections FOR SELECT USING (true);
CREATE POLICY "Allow anonymous full access sections" ON public.sections FOR ALL USING (true) WITH CHECK (true);

-- Carousel Items Table
CREATE TABLE IF NOT EXISTS public.carousel_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID REFERENCES public.sections(id) ON DELETE CASCADE,
    image_url TEXT,
    title TEXT,
    alt_text TEXT,
    video_url TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.carousel_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access carousel" ON public.carousel_items;
DROP POLICY IF EXISTS "Allow authenticated full access carousel" ON public.carousel_items;
DROP POLICY IF EXISTS "Allow anonymous full access carousel" ON public.carousel_items;

CREATE POLICY "Allow public read access carousel" ON public.carousel_items FOR SELECT USING (true);
CREATE POLICY "Allow anonymous full access carousel" ON public.carousel_items FOR ALL USING (true) WITH CHECK (true);

-- Success Stories Table
CREATE TABLE IF NOT EXISTS public.success_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    image_url TEXT,
    video_url TEXT,
    link TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access stories" ON public.success_stories;
DROP POLICY IF EXISTS "Allow authenticated full access stories" ON public.success_stories;
DROP POLICY IF EXISTS "Allow anonymous full access stories" ON public.success_stories;

CREATE POLICY "Allow public read access stories" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "Allow anonymous full access stories" ON public.success_stories FOR ALL USING (true) WITH CHECK (true);

-- Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    image_url TEXT,
    link TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access services" ON public.services;
DROP POLICY IF EXISTS "Allow authenticated full access services" ON public.services;
DROP POLICY IF EXISTS "Allow anonymous full access services" ON public.services;

CREATE POLICY "Allow public read access services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Allow anonymous full access services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- Storage buckets and policies
-- ==========================================
-- STORAGE SETUP (BUCKETS & PERMISSIONS)
-- ==========================================

-- 1. Create the 'media' bucket if it doesn't exist
-- Note: If this fails with permission errors, please create the bucket 'media' manually in the Supabase Storage UI.
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage RLS Policies
-- Clear previous policies
DROP POLICY IF EXISTS "Allow public read access media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous upload media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous update media" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous delete media" ON storage.objects;

-- Create expansive policies for development
CREATE POLICY "Allow public read access media" ON storage.objects 
FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Allow anonymous upload media" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow anonymous update media" ON storage.objects 
FOR UPDATE WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow anonymous delete media" ON storage.objects 
FOR DELETE USING (bucket_id = 'media');
