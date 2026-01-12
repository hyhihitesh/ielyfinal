'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Schema for adding a node
const addNodeSchema = z.object({
    projectId: z.string().uuid(),
    title: z.string().min(1).max(50),
    description: z.string().optional(),
    phase: z.string().optional()
})

export async function addNodeToCanvas(input: z.infer<typeof addNodeSchema>) {
    const supabase = await createClient()

    // 1. Get current max position to append to end
    const { data: nodes } = await supabase
        .from('canvas_nodes')
        .select('position')
        .eq('project_id', input.projectId)
        .order('position', { ascending: false })
        .limit(1)

    const nextPosition = (nodes && nodes[0]) ? nodes[0].position + 1 : 0

    // 2. Insert Node
    const { data, error } = await supabase
        .from('canvas_nodes')
        .insert({
            project_id: input.projectId,
            node_id: `ai_${Date.now()}`, // Simple ID generation
            title: input.title,
            description: input.description || 'Added by AI Companion',
            position: nextPosition,
            status: 'locked', // Default to locked, unless it's the very first one
            estimated_weeks: 1
        })
        .select()
        .single()

    if (error) {
        console.error('AI Add Node Error:', error)
        throw new Error('Failed to add node')
    }

    revalidatePath('/dashboard')
    return { success: true, node: data }
}

export async function markNodeComplete(nodeId: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('canvas_nodes')
        .update({ status: 'complete' })
        .eq('id', nodeId)

    if (error) throw new Error('Failed to update node')

    revalidatePath('/dashboard')
    return { success: true }
}
