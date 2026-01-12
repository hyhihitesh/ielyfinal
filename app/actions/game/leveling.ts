'use server'

import { createClient } from '@/lib/supabase/server'

// Formula: Level = Math.floor(TotalCompletedTasks / 5) + 1
// 0 tasks = Level 1
// 5 tasks = Level 2
// 10 tasks = Level 3
// ...

export async function getUserLevel() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { level: 1, progress: 0, nextLevelAt: 5, totalTasks: 0 }

    // Count completed tasks via join
    const { count } = await supabase
        .from('tasks')
        .select('*, canvas_nodes!inner(project_id, projects!inner(user_id))', { count: 'exact', head: true })
        .eq('completed', true)
        .eq('canvas_nodes.projects.user_id', user.id)

    const totalTasks = count || 0
    const TASKS_PER_LEVEL = 5

    const level = Math.floor(totalTasks / TASKS_PER_LEVEL) + 1
    const tasksInCurrentLevel = totalTasks % TASKS_PER_LEVEL
    const progress = (tasksInCurrentLevel / TASKS_PER_LEVEL) * 100

    return {
        level,
        progress, // Percentage to next level
        nextLevelAt: (level * TASKS_PER_LEVEL),
        totalTasks
    }
}
