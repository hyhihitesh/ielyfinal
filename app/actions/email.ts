'use server'

import { sendWelcomeEmail as sendWelcome, sendTaskCompletedEmail as sendTask } from '@/lib/email'
import { createClient } from '@/lib/supabase/server'

export async function sendWelcomeEmailAction() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && user.email) {
        const name = user.user_metadata?.full_name || 'Founder'
        await sendWelcome(user.email, name)
    }
}

export async function sendTaskEmailAction(taskTitle: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user && user.email) {
        await sendTask(user.email, taskTitle)
    }
}
