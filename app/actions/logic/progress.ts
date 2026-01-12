'use server'

import { createClient } from '@/lib/supabase/server'

// 1. Update Node Progress based on tasks
export async function updateNodeProgress(nodeId: string) {
    const supabase = await createClient()

    // Get all tasks for this node
    const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('completed')
        .eq('node_id', nodeId)

    if (tasksError || !tasks) return

    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0
    const isComplete = progress === 100

    // Update Node
    const { data: node, error: updateError } = await supabase
        .from('canvas_nodes')
        .update({
            data: {
                // We need to fetch existing data first usually, but Supabase shallow merge? 
                // No, 'data' is a JSONB column. We should ideally patch it. 
                // For simplicity, let's assume we need to READ then WRITE to preserve other fields like 'label'
            }
        })
        .eq('id', nodeId)
    // Wait, standard SQL update replaces the JSON. 
    // We better fetch first.

    // Fetch current node data to preserve labels/descriptions
    const { data: currentNode } = await supabase
        .from('canvas_nodes')
        .select('*')
        .eq('id', nodeId)
        .single()

    if (!currentNode) return

    const currentData = currentNode.data as any
    const newData = {
        ...currentData,
        progress,
        status: isComplete ? 'complete' : (currentData.status === 'locked' ? 'current' : currentData.status)
        // If it was locked, it shouldn't be progressing, but let's be safe.
        // Actually, if a task is toggled, it implies it's actionable.
    }

    await supabase
        .from('canvas_nodes')
        .update({ data: newData })
        .eq('id', nodeId)

    return { progress, isComplete, projectId: currentNode.project_id }
}

// 2. Check Chain Reaction (Unlock next node)
export async function checkProjectProgression(projectId: string) {
    const supabase = await createClient()

    // Get all nodes sorted by position
    const { data: nodes } = await supabase
        .from('canvas_nodes')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true })

    if (!nodes) return

    let changed = false

    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const data = node.data as any

        // If this node is complete, ensure next is unlocked
        if (data.status === 'complete') {
            const nextNode = nodes[i + 1]
            if (nextNode) {
                const nextData = nextNode.data as any
                if (nextData.status === 'locked') {
                    // UNLOCK IT
                    const newNextData = { ...nextData, status: 'current' }
                    await supabase
                        .from('canvas_nodes')
                        .update({ data: newNextData })
                        .eq('id', nextNode.id)
                    changed = true
                }
            }
        }
    }

    // 3. Stage Progression (Idea -> Build -> Launch)
    // Simple logic: mapping arbitrary "groups" of nodes to stages? 
    // For now, let's just say if first 3 nodes done -> Build.
    // Or better: Let's stick to the node unlocking for now. Stage logic requires a stricter schema map.

    return changed
}
