import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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
