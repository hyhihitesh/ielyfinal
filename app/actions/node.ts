'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireNodeOwnership } from '@/lib/auth/guard'

export async function updateNodeStatus(nodeId: string, status: string) {
    await requireNodeOwnership(nodeId)
    const supabase = await createClient()

    const { error } = await supabase
        .from('canvas_nodes')
        .update({ status })
        .eq('id', nodeId)

    if (error) throw new Error('Failed to update node status')

    revalidatePath('/dashboard')
    return { success: true }
}

export async function updateNodeDescription(nodeId: string, description: string) {
    await requireNodeOwnership(nodeId)
    const supabase = await createClient()

    const { error } = await supabase
        .from('canvas_nodes')
        .update({ description })
        .eq('id', nodeId)

    if (error) throw new Error('Failed to update node description')

    revalidatePath('/dashboard')
    return { success: true }
}
