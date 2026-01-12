import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const GET = CustomerPortal({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    getCustomerId: async (req: NextRequest) => {
        // Get current user's Polar customer ID from database
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return "";

        const { data: profile } = await supabase
            .from("users")
            .select("polar_customer_id")
            .eq("id", user.id)
            .single();

        return profile?.polar_customer_id || "";
    },
    returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    server: "production",
});
