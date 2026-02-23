import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
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
