'use server'

import { createClient } from '@/lib/supabase/server'

export interface UserStats {
    totalTasks: number
    completedTasks: number
    completionRate: number
    totalNodes: number
    completedNodes: number
    currentStreak: number
}

export async function getUserStats(projectId: string): Promise<UserStats> {
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return {
            totalTasks: 0,
            completedTasks: 0,
            completionRate: 0,
            totalNodes: 0,
            completedNodes: 0,
            currentStreak: 0,
        }
    }

    // Fetch nodes for this project
    const { data: nodes } = await supabase
        .from('canvas_nodes')
        .select('id, status')
        .eq('project_id', projectId)

    const nodesList = nodes ?? []
    const totalNodes = nodesList.length
    const completedNodes = nodesList.filter(n => n.status === 'completed').length

    // Get all node IDs for task query
    const nodeIds = nodesList.map(n => n.id)

    // Fetch tasks for these nodes
    let totalTasks = 0
    let completedTasks = 0

    if (nodeIds.length > 0) {
        const { data: tasks } = await supabase
            .from('tasks')
            .select('id, completed')
            .in('node_id', nodeIds)

        const tasksList = tasks ?? []
        totalTasks = tasksList.length
        completedTasks = tasksList.filter(t => t.completed).length
    }

    const completionRate = totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : 0

    // Calculate streak (simplified: count consecutive days with completed tasks)
    // For now, return 0 - can be enhanced with proper date tracking later
    const currentStreak = 0

    return {
        totalTasks,
        completedTasks,
        completionRate,
        totalNodes,
        completedNodes,
        currentStreak,
    }
}
