'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireNodeOwnership } from '@/lib/auth/guard'

// 1. ANONYMOUS LOGGING (Write-Only)
// Triggered when a node is marked 'complete'
export async function logMetric(nodeId: string, projectId: string) {
    const supabase = await createClient()

    // Security: Verify user owns the node they are reporting on
    // This prevents analytics pollution by malicious actors
    await requireNodeOwnership(nodeId)

    // Fetch context (Industry, Node Type, Duration)
    const { data: project } = await supabase
        .from('projects')
        .select('industry, stage')
        .eq('id', projectId)
        .single()

    const { data: node } = await supabase
        .from('canvas_nodes')
        .select('title, created_at, status') // In real app, we'd track 'started_at' vs 'completed_at'
        .eq('id', nodeId)
        .single()

    if (!project || !node) return

    // Calculate roughly duration (Mock: Created -> Now)
    // To do this accurately we need a proper 'started_at' column, but for MVP we use created_at
    const created = new Date(node.created_at).getTime()
    const now = new Date().getTime()
    const durationSeconds = Math.floor((now - created) / 1000)

    // Insert into Lake (No User ID referenced)
    await supabase.from('metrics_lake').insert({
        industry: project.industry || 'General',
        node_type: node.title, // Grouping by exact title for now
        duration_seconds: durationSeconds
    })
}

// 2. SOCIAL PUBLISHING (Minds Feed)
export async function publishPost(nodeId: string, isAnonymous: boolean) {
    // Security: Stop IDOR attacks. User must own the node.
    const { user } = await requireNodeOwnership(nodeId)

    const supabase = await createClient()

    // User is already verified by requireNodeOwnership, but we keep the object for id access if needed
    if (!user) return { success: false, message: 'Not authenticated' }

    // Get Node Snapshot
    const { data: node } = await supabase
        .from('canvas_nodes')
        .select('*, projects(industry, stage)')
        .eq('id', nodeId)
        .single()

    if (!node) return { success: false, message: 'Node not found' }

    // Create the snapshot object (minimal data)
    const snapshot = {
        title: node.title,
        status: 'complete',
        industry: (node.projects as any)?.industry,
        stage: (node.projects as any)?.stage,
        completed_at: new Date().toISOString()
    }

    const { error } = await supabase.from('minds_posts').insert({
        user_id: user.id,
        is_anonymous: isAnonymous,
        node_snapshot: snapshot
    })

    if (error) {
        console.error("Publish failed", error)
        return { success: false, message: 'Failed to publish' }
    }

    revalidatePath('/dashboard/minds')
    return { success: true, message: 'Published to Minds' }
}

// 3. FETCH FEED
export async function getMindsFeed() {
    const supabase = await createClient()

    // Fetch posts + join user profile (but mask if anonymous)
    // Supabase join: minds_posts -> users
    const { data: posts } = await supabase
        .from('minds_posts')
        .select('*, users(full_name, avatar_url)')
        .order('created_at', { ascending: false })
        .limit(20)

    return (posts || []).map(post => {
        const isAnon = post.is_anonymous
        const user = post.users as any

        return {
            id: post.id,
            snapshot: post.node_snapshot,
            likes: post.likes_count,
            createdAt: post.created_at,
            author: {
                name: isAnon ? 'Verified Founder' : (user?.full_name || 'Anonymous'),
                avatar: isAnon ? null : user?.avatar_url,
                isAnonymous: isAnon
            }
        }
    })
}
