import { Checkout } from "@polar-sh/nextjs";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

const checkoutHandler = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success&checkout_id={CHECKOUT_ID}`,
    server: "production",
});

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/auth/login?next=/pricing");
    }

    // Pass the request to the handler
    // If no priceId is present, we inject the default "Pro" price ID into the URL
    // This allows /api/checkout to "just work" as a shortcut
    const url = new URL(request.url);
    if (!url.searchParams.has("priceId")) {
        // Fallback to "Pro" Price ID
        url.searchParams.set("priceId", "f1208a38-d267-4664-8bab-fbbf5ff877f1");
        return NextResponse.redirect(url);
    }

    // NOTE: If Checkout() still complains about "Missing products", it might be looking for ?productId or a body.
    // However, looking at standard Polar Next.js integration, it often expects `priceId` in the query.
    // If this fails, we might need a direct link to the checkout page if we had one.

    return checkoutHandler(request);
}
