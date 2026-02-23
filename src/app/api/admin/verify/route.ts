import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export async function POST(request: NextRequest) {
    if (!supabase) {
        return NextResponse.json({ error: "Configuración faltante" }, { status: 500 });
    }
    try {
        const { token } = await request.json();

        if (!token) {
            return NextResponse.json({ error: "Token requerido" }, { status: 400 });
        }

        // Check session validity
        const { data: session, error } = await supabase
            .from("cms_sessions")
            .select("*, cms_users(id, username, display_name)")
            .eq("token", token)
            .gt("expires_at", new Date().toISOString())
            .single();

        if (error || !session) {
            return NextResponse.json({ error: "Sesión no válida o expirada" }, { status: 401 });
        }

        return NextResponse.json({
            valid: true,
            user: session.cms_users,
        });
    } catch (err) {
        console.error("Verify error:", err);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}
