import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { UserProfile, Roadmap } from '@/lib/types/ai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Zod Schemas for Structured Output
const UserProfileSchema = z.object({
    experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
    projectType: z.enum(['saas', 'hardware', 'mobile_app', 'consumer_web', 'other']),
    technicalBackground: z.enum(['non_technical', 'basic', 'proficient']),
    keyRisks: z.array(z.string()),
});

const CanvasNodeSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    phase: z.enum(['validate', 'build', 'launch', 'grow']),
    estimatedWeeks: z.number(),
    tasks: z.array(z.string()),
});

const RoadmapSchema = z.object({
    analysis: z.object({
        marketSummary: z.string(),
    }),
    nodes: z.array(CanvasNodeSchema),
    edges: z.array(z.object({ source: z.string(), target: z.string() })),
});

export async function analyzeUserOnboarding(idea: string): Promise<UserProfile> {
    const completion = await openai.chat.completions.parse({
        model: 'gpt-4o-mini', // Fast & Cheap for analysis
        messages: [
            {
                role: 'system',
                content: `You are an expert startup advisor. Analyze the user's startup idea and deduce their likely experience level, project type, and key technical risks.
        
        Guidelines:
        - If they mention code/API/tech stack specifically, they are likely 'proficient' or 'basic'.
        - If the idea is a physical device, it is 'hardware'.
        - If it's an app store item, 'mobile_app'.
        - If it's a website selling subs, 'saas'.`,
            },
            { role: 'user', content: idea },
        ],
        response_format: zodResponseFormat(UserProfileSchema, 'user_profile'),
    });

    return completion.choices[0].message.parsed as UserProfile;
}

export async function generatePersonalizedCanvas(idea: string, profile: UserProfile): Promise<Roadmap> {
    const completion = await openai.chat.completions.parse({
        model: 'gpt-4o', // Higher intelligence for roadmap generation
        messages: [
            {
                role: 'system',
                content: `You are a Y Combinator partner creating a personalized execution roadmap.
        
        Context:
        - Project Type: ${profile.projectType}
        - Experience: ${profile.experienceLevel}
        - Tech Background: ${profile.technicalBackground}
        
        Goal: Generate 5-7 actionable, sequential nodes (steps) to get from confirmed idea to first revenue.
        
        Rules:
        - Use IDs like "step_1", "step_2".
        - Connect them linearly in 'edges'.
        - 'tasks' should be specific (e.g., "Interview 5 people", not "Do research").
        - For 'beginner', include more educational steps.
        - For 'saas', focus on MVP and presales.
        - For 'hardware', focus on prototyping and BOM.`,
            },
            { role: 'user', content: `Here is my startup idea: ${idea}` },
        ],
        response_format: zodResponseFormat(RoadmapSchema, 'roadmap'),
    });

    return completion.choices[0].message.parsed as Roadmap;
}
