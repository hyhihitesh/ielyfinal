export type SubscriptionTier = 'free' | 'pro' | 'premium';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

export interface PricingPlan {
    id: string;
    name: string;
    price: number;
    interval: 'month' | 'year';
    description: string;
    features: string[];
    highlighted?: boolean;
    polarProductId?: string; // Set this after creating products in Polar
}

export const PRICING_PLANS: PricingPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        description: 'Get started with the basics',
        features: [
            'Full canvas with main nodes',
            '10 AI chat messages per day',
            'Basic progress tracking',
            'Community resources',
            '1 active project',
        ],
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 39,
        interval: 'month',
        description: 'For serious founders',
        features: [
            'Everything in Free',
            'Unlimited AI chat',
            'Unlimited projects',
            'Advanced analytics',
            'Custom nodes',
            'Export capabilities',
            'Priority support',
        ],
        highlighted: true,
        polarProductId: '0423cfdd-ac0e-4290-93d7-4378b10e831a', // Polar Product ID for Pro
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 149,
        interval: 'month',
        description: 'For funded startups',
        features: [
            'Everything in Pro',
            'All premium plugins',
            'Specialized AI advisors',
            'Investor intro credits (5/month)',
            'White-glove support',
            'Early access to features',
            'API access',
        ],
        polarProductId: 'b61bac83-d022-4e77-b34d-d3a4fff6045f', // Polar Product ID for Premium
    },
];
