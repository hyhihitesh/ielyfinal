import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export type DocumentChunk = {
    id: number
    content: string
    metadata: Record<string, any>
    similarity: number
}

export async function generateEmbedding(text: string): Promise<number[]> {
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.replace(/\n/g, ' ')
    })
    return response.data[0].embedding
}

export async function searchDocuments(query: string, limit = 5): Promise<DocumentChunk[]> {
    const supabase = await createClient()
    const embedding = await generateEmbedding(query)

    const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.5, // Context needs to be somewhat relevant
        match_count: limit
    })

    if (error) {
        console.error('Vector search failed', error)
        return []
    }

    return (data || []) as DocumentChunk[]
}
