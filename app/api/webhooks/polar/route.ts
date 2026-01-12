import { Webhooks } from "@polar-sh/nextjs";
import { createClient } from "@supabase/supabase-js";

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
    onPayload: async (event: any) => {
        // Initialize Supabase Admin strictly for the webhook context
        // Moved inside handler to avoid build-time execution issues
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        console.log(`[Polar Webhook] Received event: ${event.type}`);

        switch (event.type) {
            case "subscription.created":
            case "subscription.updated": {
                const subscription = event.data;
                const email = subscription.user?.email || subscription.customer?.email;

                if (!email) {
                    console.error("[Polar Webhook] No email found in subscription event");
                    return; // Webhooks helper handles the 200/400 response
                }

                console.log(`[Polar Webhook] Processing subscription for ${email}`);

                // Find User ID by Email
                const { data: userConfig, error: userError } = await supabaseAdmin
                    .from('users')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (userError || !userConfig) {
                    console.error(`[Polar Webhook] User not found for email: ${email}`, userError);
                    return;
                }

                // Update User Subscription
                const productName = subscription.product?.name?.toLowerCase() || 'pro';
                let tier = 'free';
                if (productName.includes('pro') || productName.includes('venture')) tier = 'pro';
                if (productName.includes('premium')) tier = 'premium';

                const { error: updateError } = await supabaseAdmin
                    .from('users')
                    .update({
                        subscription_tier: tier,
                        subscription_status: 'active',
                        polar_customer_id: subscription.customer_id,
                        current_period_end: subscription.current_period_end ? new Date(subscription.current_period_end).toISOString() : null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', userConfig.id);

                if (updateError) {
                    console.error("[Polar Webhook] Failed to update user:", updateError);
                } else {
                    console.log(`[Polar Webhook] User ${userConfig.id} upgraded to ${tier}`);
                }
                break;
            }

            case "subscription.canceled": {
                console.log("[Polar Webhook] Subscription canceled");
                break;
            }

            default:
                console.log(`[Polar Webhook] Unhandled event type: ${event.type}`);
        }
    },
});

