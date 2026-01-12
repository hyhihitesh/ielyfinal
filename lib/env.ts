import { z } from 'zod';

/**
 * Environment variable validation
 * Validates at module load time (fail fast)
 */

const envSchema = z.object({
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

    // OpenAI (via AI SDK)
    OPENAI_API_KEY: z.string().min(1),

    // Polar (optional in dev)
    POLAR_ACCESS_TOKEN: z.string().optional(),
    POLAR_WEBHOOK_SECRET: z.string().optional(),

    // App
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),

    // Analytics (optional)
    NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().optional(),
});

function validateEnv() {
    // Only validate on server
    if (typeof window !== 'undefined') return;

    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('❌ Invalid environment variables:');
        result.error.issues.forEach(issue => {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
        });

        // In production, fail fast
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Invalid environment configuration');
        }
    }
}

// Run validation on module import
validateEnv();

// Type-safe env access
export const env = {
    supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY ?? '',
    },
    polar: {
        accessToken: process.env.POLAR_ACCESS_TOKEN ?? '',
        webhookSecret: process.env.POLAR_WEBHOOK_SECRET ?? '',
    },
    app: {
        url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    },
    analytics: {
        mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? '',
    },
};
