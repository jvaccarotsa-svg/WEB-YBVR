import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export async function POST(request: NextRequest) {
    if (!supabase) return NextResponse.json({ success: true });
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
