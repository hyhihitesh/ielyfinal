'use server'

import { createClient } from '@/lib/supabase/server'
import { Roadmap, UserProfile } from '@/lib/types/ai'
import { redirect } from 'next/navigation'

export async function saveProject(idea: string, profile: UserProfile, roadmap: Roadmap) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('User not authenticated')
    }

    // --- PHASE 9: LIMIT CHECK ---
    const { checkResourceLimit } = await import('./subscription')
    const limitCheck = await checkResourceLimit('projects')
    if (!limitCheck.allowed) {
        throw new Error(limitCheck.message || 'Project limit reached')
    }
    // ----------------------------

    // ----------------------------

    // Prepare Data for RPC
    const nodesJson = roadmap.nodes.map((node, index) => ({
        node_id: node.id,
        title: node.title,
        description: node.description,
        position: index,
        status: index === 0 ? 'current' : 'locked',
        estimated_weeks: node.estimatedWeeks,
        ai_insight: roadmap.analysis.marketSummary
    }))

    // Flatten tasks into a single list with node_id reference
    const tasksJson: { node_id: string; title: string }[] = []
    roadmap.nodes.forEach(node => {
        if (node.tasks) {
            node.tasks.forEach(task => {
                tasksJson.push({
                    node_id: node.id,
                    title: task
                })
            })
        }
    })

    // 2. Call Atomic RPC
    const { data: projectId, error: rpcError } = await supabase.rpc('create_complete_project', {
        p_user_id: user.id,
        p_title: roadmap.nodes[0]?.title || 'My Startup',
        p_description: idea,
        p_experience_level: profile.experienceLevel,
        p_project_type: profile.projectType,
        p_technical_background: profile.technicalBackground,
        p_nodes: nodesJson,
        p_tasks: tasksJson
    })

    if (rpcError) {
        console.error('RPC Error:', rpcError)
        throw new Error('Failed to create project (Atomic Transaction Failed)')
    }

    /* 
       Legacy Code Removed:
       - Insert Project
       - Insert Nodes
       - Insert Tasks
       
       Now handled by 'create_complete_project' database function.
    */

    return projectId as string
}
