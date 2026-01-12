'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import OpenAI from 'openai'
import { z } from 'zod'
import { requireNodeOwnership, requireTaskOwnership } from '@/lib/auth/guard'

// Validation schemas
const addTaskSchema = z.object({
    nodeId: z.string().uuid(),
    title: z.string().min(1, 'Task title is required').max(500),
})

export type Task = {
    id: string;
    node_id: string;
    title: string;
    completed: boolean;
    priority?: string;
}

export async function getTasks(nodeId: string): Promise<Task[]> {
    const supabase = await createClient()

    const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('node_id', nodeId)
        .order('created_at', { ascending: true })

    // Safe cast with fallback
    return (data ?? []) as Task[]
}

export async function toggleTask(taskId: string, completed: boolean) {
    // 1. Security Check
    await requireTaskOwnership(taskId)

    const supabase = await createClient()

    const { error } = await supabase
        .from('tasks')
        .update({ completed, completed_at: completed ? new Date().toISOString() : null })
        .eq('id', taskId)

    if (error) throw new Error('Failed to toggle task')

    // Check for badge awards when completing a task
    if (completed) {
        const { checkAndAwardBadges } = await import('./badges')
        // ... (existing badge logic) ...
        const { data: { user } } = await supabase.auth.getUser()
        // ...
        if (user) {
            // ...
            const { count } = await supabase
                .from('tasks')
                .select('*, canvas_nodes!inner(project_id, projects!inner(user_id))', { count: 'exact', head: true })
                .eq('completed', true)
                .eq('canvas_nodes.projects.user_id', user.id)

            await checkAndAwardBadges(count ?? 0)
        }
    }

    // --- PHASE 8: BUSINESS LOGIC START ---
    try {
        const { updateNodeProgress, checkProjectProgression } = await import('./logic/progress')
        const { data: task } = await supabase.from('tasks').select('node_id').eq('id', taskId).single()

        if (task) {
            const result = await updateNodeProgress(task.node_id)
            if (result?.isComplete) {
                await checkProjectProgression(result.projectId)

                // --- PHASE 10: LOG METRIC ---
                const { logMetric } = await import('./minds')
                await logMetric(task.node_id, result.projectId)
                // ----------------------------
            }
        }
    } catch (e) {
        console.error("Progress logic failed", e)
    }
    // --- PHASE 8 END ---

    revalidatePath('/dashboard')
    return { success: true }
}

export async function addTask(nodeId: string, title: string) {
    // 1. Security Check: Verify Ownership
    await requireNodeOwnership(nodeId)

    // 2. Validate input
    const validation = addTaskSchema.safeParse({ nodeId, title })
    if (!validation.success) {
        throw new Error(validation.error.issues[0]?.message ?? 'Invalid input')
    }

    const supabase = await createClient()

    const { data, error } = await supabase
        .from('tasks')
        .insert({
            node_id: validation.data.nodeId,
            title: validation.data.title.trim(),
            completed: false,
            priority: 'medium'
        })
        .select()
        .single()

    if (error) throw new Error('Failed to create task')

    revalidatePath('/dashboard')
    return data
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSubsteps(nodeId: string, nodeTitle: string, context: string) {
    const supabase = await createClient()

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert startup mentor.
                    Context: ${context}
                    Task: Break down the node "${nodeTitle}" into 3-5 actionable sub-tasks.
                    Return ONLY a raw JSON array of strings (no markdown, no code block).
                    Example: ["Identify target audience", "Create survey form", "Distribute to 10 people"]`
                },
                {
                    role: "user",
                    content: `Break down: ${nodeTitle}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || '{"tasks": []}';
        // Handle potentially wrapped JSON (e.g. { "tasks": [...] } or just [...])
        let tasks: string[] = [];
        try {
            const parsed = JSON.parse(content);
            if (Array.isArray(parsed)) {
                tasks = parsed;
            } else if (parsed.tasks && Array.isArray(parsed.tasks)) {
                tasks = parsed.tasks;
            } else {
                // Fallback if structure is unexpected but parsable object
                tasks = Object.values(parsed).flat().filter((t): t is string => typeof t === 'string');
            }
        } catch (e) {
            console.error("Failed to parse AI response", content);
            return [];
        }

        // Insert tasks
        if (tasks.length > 0) {
            const tasksToInsert = tasks.map(title => ({
                node_id: nodeId,
                title,
                completed: false,
                priority: 'medium'
            }));

            const { error } = await supabase
                .from('tasks')
                .insert(tasksToInsert);

            if (error) throw error;
        }

        revalidatePath('/dashboard');
        return getTasks(nodeId); // Return updated list

    } catch (error) {
        console.error('AI Generate Error:', error);
        throw new Error('Failed to generate sub-steps');
    }
}
