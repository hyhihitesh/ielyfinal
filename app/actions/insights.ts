'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function generateNodeInsight(nodeId: string, projectId: string) {
    const supabase = await createClient()

    // Fetch node details
    const { data: node } = await supabase
        .from('canvas_nodes')
        .select('*')
        .eq('id', nodeId)
        .single()

    if (!node) return "Unable to analyze this node."

    try {
        const { text } = await generateText({
            model: openai('gpt-4o'),
            system: "You are a pragmatic startup co-founder. Give one continuous sentence of specific, actionable advice for completing this step. Be direct and encouraging.",
            prompt: `Step: ${node.title}\nDescription: ${node.description || 'No description provided.'}`
        })
        return text
    } catch (error) {
        console.error("AI Insight Error:", error)
        return "Focus on the users first. (AI Error)"
    }
}

export async function markInsightRead(insightId: string) {
    const supabase = await createClient()

    // 1. Mark as read
    const { error } = await supabase
        .from('project_insights')
        .update({ is_read: true })
        .eq('id', insightId)

    if (error) {
        console.error('Error marking insight as read:', error)
        throw new Error('Failed to update insight')
    }

    // 2. Revalidate dashboard to update UI
    revalidatePath('/dashboard')
}
