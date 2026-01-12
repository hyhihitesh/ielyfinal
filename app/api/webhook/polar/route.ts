import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@/lib/supabase/server";

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    onPayload: async (payload) => {
        console.log("Polar webhook received:", payload.type);
    },
    onOrderCreated: async (order) => {
        console.log("Order created:", (order as any).id);

        // Update user subscription in database
        const supabase = await createClient();

        // Extract customer email from order
        const customerEmail = (order as any).customer?.email;
        if (!customerEmail) return;

        // Update user's subscription status
        await supabase
            .from("users")
            .update({
                subscription_tier: "pro",
                subscription_status: "active",
            })
            .eq("email", customerEmail);
    },
    onSubscriptionUpdated: async (subscription) => {
        console.log("Subscription updated:", (subscription as any).id);
    },
    onSubscriptionCanceled: async (subscription) => {
        console.log("Subscription canceled:", (subscription as any).id);

        const supabase = await createClient();

        const customerEmail = (subscription as any).customer?.email;
        if (!customerEmail) return;

        await supabase
            .from("users")
            .update({
                subscription_status: "canceled",
            })
            .eq("email", customerEmail);
    },
});
