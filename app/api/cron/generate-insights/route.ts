import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export const maxDuration = 300 // 5 minutes for batch processing

export async function GET(req: Request) {
    // 1. Security Check
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const supabase = await createClient()

    // 2. Fetch Active Users (Simulated: Just getting last 50 updated projects)
    const { data: projects } = await supabase
        .from('projects')
        .select(`
            id, 
            user_id, 
            title, 
            canvas_nodes (
                id, 
                title, 
                status, 
                updated_at
            )
        `)
        .order('updated_at', { ascending: false })
        .limit(50)

    if (!projects) return NextResponse.json({ processed: 0 })

    const results = []

    // 3. Process Each Project
    for (const project of projects) {
        // Find stalled nodes (e.g., 'current' for > 7 days)
        // For MVP, we'll just look for ANY current node
        const currentNode = project.canvas_nodes.find(n => n.status === 'current')

        if (currentNode) {
            // Generate Insight
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o', // Or gpt-4o-mini for cost
                messages: [
                    {
                        role: "system",
                        content: "You are a startup mentor. Analyze the user's status and give 1 sentence of brutal but helpful advice."
                    },
                    {
                        role: "user",
                        content: `Project: ${project.title}. Current Node: ${currentNode.title}. Status: Stuck here.`
                    }
                ]
            })

            const advice = completion.choices[0].message.content || "Keep going!"

            // Save to DB
            const { error } = await supabase
                .from('project_insights')
                .insert({
                    project_id: project.id,
                    type: 'strategy',
                    content: advice,
                    action_label: 'View Node',
                    action_url: `/dashboard/canvas?node=${currentNode.id}`
                })

            if (!error) results.push({ project: project.title, advice })
        }
    }

    return NextResponse.json({
        success: true,
        processed: results.length,
        results
    })
}
