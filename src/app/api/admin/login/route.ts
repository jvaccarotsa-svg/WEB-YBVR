import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json(
            { error: "Variables de entorno NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY no encontradas en el servidor" },
            { status: 500 }
        );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: "Usuario y contraseña son obligatorios" },
                { status: 400 }
            );
        }

        // Verify credentials using the RPC function (uses pgcrypto crypt())
        const { data: users, error } = await supabase.rpc("verify_cms_password", {
            input_username: username,
            input_password: password,
        });

        if (error) {
            console.error("RPC error:", error);
            return NextResponse.json(
                { error: "Error al verificar credenciales" },
                { status: 500 }
            );
        }

        if (!users || users.length === 0) {
            return NextResponse.json(
                { error: "Usuario o contraseña incorrectos" },
                { status: 401 }
            );
        }

        const user = users[0];

        // Generate session token
        const token = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Store session
        const { error: sessionError } = await supabase.from("cms_sessions").insert({
            token,
            user_id: user.id,
            expires_at: expiresAt.toISOString(),
        });

        if (sessionError) {
            console.error("Session creation error:", sessionError);
            return NextResponse.json(
                { error: "Error al crear la sesión" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                display_name: user.display_name,
            },
            expires_at: expiresAt.toISOString(),
        });
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
