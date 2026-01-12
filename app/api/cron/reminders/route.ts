import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, getReminderEmailHtml } from '@/lib/email/resend'

// Cron job to send reminder emails to inactive users
// This should be triggered by Vercel Cron or an external scheduler
// In Vercel, add to vercel.json: { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 9 * * *" }] }

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    // Verify cron secret (for security)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    // In production, always verify the secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use Service Role Key if available for admin access (required to scan all users)
    // Fallback to Anon Key (might fail RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        return NextResponse.json({ error: 'Supabase configuration missing' }, { status: 500 })
    }

    // Create a direct client without cookie handling
    const supabase = createClient(supabaseUrl, supabaseKey)

    try {
        // Find users who haven't had activity in 3+ days
        // Query users table and check last login or activity
        const threeDaysAgo = new Date()
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

        // Get users with their most recent project
        const { data: inactiveUsers, error } = await supabase
            .from('users')
            .select(`
                id,
                email,
                full_name,
                updated_at
            `)
            .lt('updated_at', threeDaysAgo.toISOString())
            .not('email', 'is', null)
            .limit(50) // Process in batches

        if (error) {
            console.error('Failed to fetch inactive users:', error.message)
            return NextResponse.json({ error: 'Database error: ' + error.message }, { status: 500 })
        }

        if (!inactiveUsers || inactiveUsers.length === 0) {
            return NextResponse.json({ message: 'No inactive users to notify', sent: 0 })
        }

        let sentCount = 0
        const results: { email: string; success: boolean }[] = []

        for (const user of inactiveUsers) {
            if (!user.email) continue

            // Get user's most recent project for personalization
            const { data: project } = await supabase
                .from('projects')
                .select('title')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false })
                .limit(1)
                .single()

            const projectTitle = project?.title ?? 'your startup'
            const userName = user.full_name ?? user.email.split('@')[0]

            // Calculate days inactive
            const lastActive = new Date(user.updated_at)
            const daysInactive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24))

            const html = getReminderEmailHtml(userName, projectTitle, daysInactive)

            // Send email using Resend
            const result = await sendEmail({
                to: user.email,
                subject: `🚀 Your startup journey awaits, ${userName}!`,
                html,
            })

            results.push({ email: user.email, success: result.success })
            if (result.success) sentCount++
        }

        return NextResponse.json({
            message: 'Reminder emails processed',
            sent: sentCount,
            total: inactiveUsers.length,
            results
        })

    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('Cron job error:', message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
