'use client';

import { Button } from '@/components/ui/button';
import { Check, Sparkles } from 'lucide-react';
import { PRICING_PLANS, PricingPlan } from '@/lib/types/subscription';

interface PricingCardProps {
    plan: PricingPlan;
    currentTier?: string;
}

function PricingCard({ plan, currentTier }: PricingCardProps) {
    const isCurrentPlan = currentTier === plan.id;
    const isFree = plan.price === 0;

    const handleUpgrade = () => {
        if (isFree || isCurrentPlan) return;

        // Redirect to Polar checkout with product ID
        const checkoutUrl = `/api/checkout?productId=${plan.polarProductId}`;
        window.location.href = checkoutUrl;
    };

    return (
        <div
            className={`relative rounded-2xl p-8 ${plan.highlighted
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                }`}
        >
            {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Sparkles className="w-4 h-4" /> Most Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className={`text-2xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.name}
                </h3>
                <p className={`mt-2 ${plan.highlighted ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}`}>
                    {plan.description}
                </p>
            </div>

            <div className="mb-8">
                <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    ${plan.price}
                </span>
                <span className={plan.highlighted ? 'text-indigo-100' : 'text-slate-600 dark:text-slate-400'}>
                    /{plan.interval}
                </span>
            </div>

            <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 shrink-0 mt-0.5 ${plan.highlighted ? 'text-indigo-200' : 'text-indigo-600'}`} />
                        <span className={plan.highlighted ? 'text-indigo-50' : 'text-slate-700 dark:text-slate-300'}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>

            <Button
                onClick={handleUpgrade}
                disabled={isCurrentPlan || isFree}
                className={`w-full ${plan.highlighted
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                        : isCurrentPlan
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
            >
                {isCurrentPlan ? 'Current Plan' : isFree ? 'Free Forever' : 'Upgrade Now'}
            </Button>
        </div>
    );
}

interface PricingSectionProps {
    currentTier?: string;
}

export function PricingSection({ currentTier = 'free' }: PricingSectionProps) {
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Start free, upgrade when you're ready. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-center">
                    {PRICING_PLANS.map((plan) => (
                        <PricingCard key={plan.id} plan={plan} currentTier={currentTier} />
                    ))}
                </div>
            </div>
        </section>
    );
}
