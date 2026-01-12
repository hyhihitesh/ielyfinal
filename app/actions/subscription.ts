'use server';

import { createClient } from '@/lib/supabase/server';

export async function getSubscriptionStatus() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { tier: 'free', status: 'inactive' };
    }

    const { data: subscription } = await supabase
        .from('users')
        .select('subscription_tier, subscription_status, current_period_end')
        .eq('id', user.id)
        .single();

    return {
        tier: subscription?.subscription_tier || 'free',
        status: subscription?.subscription_status || 'inactive',
        renewsAt: subscription?.current_period_end
    };
}

// Resource Limits Definition
const LIMITS = {
    free: {
        projects: 1,
        nodesPerProject: 5,
    },
    pro: {
        projects: Infinity,
        nodesPerProject: Infinity,
    }
}

export async function checkResourceLimit(
    limitType: 'projects' | 'nodes',
    currentProjectId?: string
): Promise<{ allowed: boolean; message?: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { allowed: false, message: 'Not authenticated' }

    // Fetch Subscription Status
    const { data: userData } = await supabase
        .from('users')
        .select('subscription_tier, subscription_status')
        .eq('id', user.id)
        .single()

    const tier = (userData?.subscription_status === 'active' && userData?.subscription_tier === 'pro') ? 'pro' : 'free'
    const limits = LIMITS[tier]

    if (tier === 'pro') return { allowed: true }

    // Check Project Limit
    if (limitType === 'projects') {
        const { count } = await supabase
            .from('projects')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        if ((count || 0) >= limits.projects) {
            return {
                allowed: false,
                message: `Free Plan limited to ${limits.projects} project. Upgrade for unlimited.`
            }
        }
    }

    // Check Node Limit
    if (limitType === 'nodes' && currentProjectId) {
        const { count } = await supabase
            .from('canvas_nodes')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', currentProjectId)

        if ((count || 0) >= limits.nodesPerProject) {
            return {
                allowed: false,
                message: `Free Plan limited to ${limits.nodesPerProject} steps per project. Upgrade to add more.`
            }
        }
    }

    return { allowed: true }
}
