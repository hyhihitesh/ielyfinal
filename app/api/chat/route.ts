import { createClient } from '@/lib/supabase/server'
import { convertToModelMessages, streamText, UIMessage, stepCountIs } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { addNodeToCanvas, markNodeComplete } from '@/app/actions/ai-ops'
import { searchDocuments } from '@/lib/ai/rag'
import { saveChat } from '@/app/actions/chat'

export const maxDuration = 60

export async function POST(req: Request) {
    const { messages, context }: { messages: UIMessage[], context?: { page?: string; projectId?: string } } = await req.json()
    const supabase = await createClient()

    // 1. Get User Context
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return new Response('Unauthorized', { status: 401 })

    // 2. Load Project Data for Context
    let projectContext = ''
    if (context?.projectId) {
        const { data: project } = await supabase
            .from('projects')
            .select('title, stage')
            .eq('id', context.projectId)
            .single()

        const { data: nodes } = await supabase
            .from('canvas_nodes')
            .select('node_id, title, status, description')
            .eq('project_id', context.projectId)
            .order('position', { ascending: true })

        if (project && nodes) {
            projectContext = `
PROJECT: "${project.title}" (Stage: ${project.stage || 'Idea'})

ROADMAP NODES:
${nodes.map((n, i) => `${i + 1}. [${n.status?.toUpperCase()}] ${n.title} - ${n.description || 'No description'}`).join('\n')}
`
        }
    }

    // 3. System Prompt with Full Context
    const systemPrompt = `
You are Piely's AI Co-Founder. You are sassy, direct, but extremely helpful.
You have FULL MEMORY of our past conversations.

${projectContext ? `--- CURRENT PROJECT ---\n${projectContext}` : ''}

User Context:
- Current Page: ${context?.page || 'Unknown'}

Capabilities:
- You can ADD nodes to the canvas if the user asks.
- You can MARK nodes as complete.
- You MUST search the library if the user asks "How do I..." or for guides.

Style:
- Short answers (< 3 sentences).
- Use emojis.
- Reference their project/nodes when relevant.
`

    // 4. Stream with Tools and Persistence
    const result = streamText({
        model: openai('gpt-4o'),
        system: systemPrompt,
        messages: await convertToModelMessages(messages),
        stopWhen: stepCountIs(5),
        tools: {
            addNode: {
                description: 'Add a new node to the roadmap canvas',
                inputSchema: z.object({
                    title: z.string().describe('Title of the node (e.g. "Hire Sales")'),
                    description: z.string().optional().describe('Why this node is needed'),
                    phase: z.string().optional()
                }),
                execute: async ({ title, description, phase }: { title: string; description?: string; phase?: string }) => {
                    if (!context?.projectId) return 'Error: No active project found.'
                    await addNodeToCanvas({ projectId: context.projectId, title, description, phase })
                    return `Added node "${title}" to your canvas.`
                },
            },
            markComplete: {
                description: 'Mark a node as complete',
                inputSchema: z.object({
                    nodeId: z.string().describe('The UUID of the node to complete')
                }),
                execute: async ({ nodeId }: { nodeId: string }) => {
                    await markNodeComplete(nodeId)
                    return `Marked node as complete. Great job!`
                },
            },
            searchResources: {
                description: 'Search for guides and resources in the library',
                inputSchema: z.object({
                    query: z.string().describe('The search query')
                }),
                execute: async ({ query }: { query: string }) => {
                    const docs = await searchDocuments(query)
                    return docs.length > 0
                        ? JSON.stringify(docs.map(d => ({ content: d.content, id: d.id })))
                        : "No relevant guides found."
                },
            }
        },
        onFinish: async ({ response }) => {
            // Save all messages including AI response to database
            if (context?.projectId) {
                try {
                    // Merge original messages with new response messages
                    const allMessages = [...messages]
                    // The response.messages contains the assistant's reply
                    // We'll save on the client side for now to avoid complexity
                } catch (error) {
                    console.error('Failed to save chat:', error)
                }
            }
        },
    })

    return result.toUIMessageStreamResponse({
        originalMessages: messages,
    })
}

