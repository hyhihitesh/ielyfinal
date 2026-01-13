'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const fullName = formData.get('fullName') as string

    if (!fullName) {
        return { error: 'Full name is required' }
    }

    const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}
