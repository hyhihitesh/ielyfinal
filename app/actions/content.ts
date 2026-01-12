'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateNodeGuide(nodeId: string, nodeTitle: string, nodeDescription: string, projectContext: string) {
    const supabase = await createClient();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are an expert startup mentor. 
                    Target ID: "${nodeTitle}". 
                    Context: ${projectContext}.
                    
                    Write a practical, step-by-step tutorial in Markdown for this specific task.
                    Include:
                    - **Goal**: Why this matters.
                    - **Steps**: 3-5 actionable steps.
                    - **Checklist**: Things to verify.
                    - **Tools**: Recommended free tools.
                    
                    Tone: Encouraging, specific, actionable.
                    Format: Markdown.`
                },
                {
                    role: "user",
                    content: `Please guide me on: ${nodeDescription || nodeTitle}`
                }
            ],
        });

        const guide = completion.choices[0].message.content || "# Error Generating Guide";

        // Save to DB
        const { error } = await supabase
            .from('canvas_nodes')
            .update({ content: guide })
            .eq('id', nodeId);

        if (error) {
            console.error('Failed to save guide', error);
            throw new Error('Failed to save guide: ' + error.message);
        }

        revalidatePath('/dashboard');
        return guide;

    } catch (error) {
        console.error('AI Error:', error);
        throw new Error('Failed to generate guide');
    }
}
