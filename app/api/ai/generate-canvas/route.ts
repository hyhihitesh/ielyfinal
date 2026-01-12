import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedCanvas } from '@/lib/ai/onboarding';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60; // Allow 60s for AI

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { idea, profile } = await req.json();

        if (!idea || !profile) {
            return NextResponse.json({ error: 'Missing idea or profile' }, { status: 400 });
        }

        const roadmap = await generatePersonalizedCanvas(idea, profile);
        return NextResponse.json(roadmap);
    } catch (error) {
        console.error('AI Generation Error:', error);
        return NextResponse.json({ error: 'Failed to generate roadmap' }, { status: 500 });
    }
}
