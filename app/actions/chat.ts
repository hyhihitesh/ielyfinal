'use server'

import { createClient } from '@/lib/supabase/server'
import { UIMessage } from 'ai'

/**
 * Get or create a chat session for a user+project combo
 */
export async function getOrCreateSession(projectId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    // Try to find existing session
    const { data: existing } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .single()

    if (existing) return existing

    // Create new session
    const { data: newSession, error } = await supabase
        .from('chat_sessions')
        .insert({
            user_id: user.id,
            project_id: projectId,
        })
        .select()
        .single()

    if (error) throw error
    return newSession
}

/**
 * Load chat history for a project
 */
export async function loadChat(projectId: string): Promise<UIMessage[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // Get session
    const { data: session } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .single()

    if (!session) return []

    // Get messages
    const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true })

    if (!messages) return []

    // Convert to UIMessage format
    return messages.map((msg) => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        parts: [{ type: 'text' as const, text: msg.content }],
    }))
}

/**
 * Save messages after chat completion
 */
export async function saveChat(projectId: string, messages: UIMessage[]) {
    const supabase = await createClient()

    // Get or create session
    const session = await getOrCreateSession(projectId)

    // Get existing messages to avoid duplicates (by content hash)
    const { data: existingMessages } = await supabase
        .from('chat_messages')
        .select('content, role')
        .eq('session_id', session.id)

    // Create a set of existing content hashes for deduplication
    const existingHashes = new Set(
        existingMessages?.map(m => `${m.role}:${m.content}`) || []
    )

    // Extract text content from each message
    const toInsert = messages
        .map(msg => {
            const content = msg.parts
                ?.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
                .map(p => p.text)
                .join('') || ''

            return {
                session_id: session.id,
                role: msg.role,
                content,
            }
        })
        .filter(msg => {
            // Skip empty messages and duplicates
            const hash = `${msg.role}:${msg.content}`
            return msg.content.trim() !== '' && !existingHashes.has(hash)
        })

    if (toInsert.length === 0) {
        console.log('[saveChat] No new messages to save')
        return
    }

    console.log('[saveChat] Inserting', toInsert.length, 'messages')

    const { error } = await supabase
        .from('chat_messages')
        .insert(toInsert)

    if (error) {
        console.error('[saveChat] Failed:', error)
        throw error
    }

    console.log('[saveChat] Success!')
}
