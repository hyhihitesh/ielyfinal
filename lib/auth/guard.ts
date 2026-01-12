import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Validates that the current user owns the project associated with a node.
 * Throws an error (which is caught by Next.js error boundary) if validation fails.
 */
export async function requireNodeOwnership(nodeId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized: You must be logged in')
    }

    // Check if the node belongs to a project owned by the user
    // We use !inner join to filter strictly
    const { data: node } = await supabase
        .from('canvas_nodes')
        .select(`
            id,
            project_id,
            projects!inner(user_id)
        `)
        .eq('node_id', nodeId) // Match the public nodeId UUID
        .eq('projects.user_id', user.id) // Ensure project matches user
        .single()

    if (!node) {
        // Obfuscated error message for security (don't reveal if ID exists)
        throw new Error('Unauthorized: Resource not found or access denied')
    }

    return { user, node }
}

/**
 * Validates task ownership directly
 */
export async function requireTaskOwnership(taskId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: task } = await supabase
        .from('tasks')
        .select(`
            id,
            canvas_nodes!inner(
                project_id,
                projects!inner(user_id)
            )
        `)
        .eq('id', taskId)
        .eq('canvas_nodes.projects.user_id', user.id)
        .single()

    if (!task) {
        throw new Error('Unauthorized operation')
    }

    return { user, task }
}
