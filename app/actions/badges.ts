'use server'

import { createClient } from '@/lib/supabase/server'
import { BadgeType, UserBadge } from '@/lib/types/gamification'
import { revalidatePath } from 'next/cache'

export async function getUserBadges(): Promise<UserBadge[]> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })

    return (data ?? []) as UserBadge[]
}

export async function awardBadge(badgeType: BadgeType): Promise<boolean> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    // Check if already earned (unique constraint will also prevent duplicates)
    const { data: existing } = await supabase
        .from('badges')
        .select('id')
        .eq('user_id', user.id)
        .eq('badge_type', badgeType)
        .single()

    if (existing) return false // Already has this badge

    const { error } = await supabase
        .from('badges')
        .insert({
            user_id: user.id,
            badge_type: badgeType,
        })

    if (error) {
        console.error('Failed to award badge:', error.message)
        return false
    }

    revalidatePath('/dashboard')
    return true
}

export async function checkAndAwardBadges(completedTasksCount: number): Promise<BadgeType[]> {
    const awarded: BadgeType[] = []

    // First task badge
    if (completedTasksCount === 1) {
        const success = await awardBadge('first_task')
        if (success) awarded.push('first_task')
    }

    // 10 tasks badge
    if (completedTasksCount === 10) {
        const success = await awardBadge('task_master_10')
        if (success) awarded.push('task_master_10')
    }

    // 50 tasks badge
    if (completedTasksCount === 50) {
        const success = await awardBadge('task_master_50')
        if (success) awarded.push('task_master_50')
    }

    return awarded
}
