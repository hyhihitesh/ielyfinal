import { NextRequest, NextResponse } from 'next/server';
import { analyzeUserOnboarding } from '@/lib/ai/onboarding';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60; // Allow 60s for AI (if on Pro)

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { idea } = await req.json();

        if (!idea || idea.length < 10) {
            return NextResponse.json({ error: 'Idea too short' }, { status: 400 });
        }

        const profile = await analyzeUserOnboarding(idea);
        return NextResponse.json(profile);
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return NextResponse.json({ error: 'Failed to analyze idea' }, { status: 500 });
    }
}
