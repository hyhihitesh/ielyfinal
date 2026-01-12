'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schemas
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(1, 'Password is required'),
})

const signupSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function login(formData: FormData) {
    const supabase = await createClient()

    // Validate input
    const result = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || 'Invalid input'
        redirect(`/auth/login?error=${encodeURIComponent(errorMessage)}`)
    }

    const { email, password } = result.data

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login Error:', error.message)
        redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    // Validate input
    const result = signupSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!result.success) {
        const errorMessage = result.error.issues[0]?.message || 'Invalid input'
        redirect(`/auth/signup?error=${encodeURIComponent(errorMessage)}`)
    }

    const { email, password } = result.data

    const { error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        console.error('Signup Error:', error.message)
        redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`)
    }

    revalidatePath('/', 'layout')
    redirect('/onboarding')
}

