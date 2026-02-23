import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

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
