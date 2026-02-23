import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) return NextResponse.json({ success: true });

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { token } = await request.json();

        if (token) {
            await supabase.from("cms_sessions").delete().eq("token", token);
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Logout error:", err);
        return NextResponse.json({ success: true }); // Always succeed logout
    }
}
