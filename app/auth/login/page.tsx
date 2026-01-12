'use client'

import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Mail, Smartphone, AlertCircle } from 'lucide-react' // Using generic icons for Google/Apple placeholders or just text
import { useSearchParams } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { Suspense, useState } from 'react'
import { cn } from '@/lib/utils'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <div className="grid grid-cols-2 gap-4 mt-8">
            <Button
                type="submit"
                variant="outline"
                className="h-12 rounded-none border border-border uppercase tracking-widest text-xs font-mono hover:bg-foreground hover:text-background transition-colors"
                disabled={pending}
            >
                {pending ? '...' : 'Log In'}
            </Button>
            <Link href="/auth/signup" className="w-full">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 rounded-none border border-border uppercase tracking-widest text-xs font-mono hover:bg-foreground hover:text-background transition-colors"
                >
                    Sign Up
                </Button>
            </Link>
        </div>
    )
}

function LoginForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email')

    return (
        <div className="w-full max-w-[480px] mx-auto px-6 py-12 flex flex-col justify-center min-h-[80vh]">
            {/* Header / Logo */}
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-[#D4CDBC] font-serif">PIELY</h1> {/* Using a beige/gold hex to match image somewhat, or just standard foreground if theme handles it. Using Serif for 'PIELY' logo look? Actually looking at image it's Sans but Gold/Greenish. Let's use theme color. */}
                <h1 className="text-3xl font-bold tracking-tighter text-foreground/80">PIELY</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">
                    Decision Intelligence
                </p>
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <Button variant="outline" className="h-12 rounded-none border border-border font-mono text-[10px] uppercase tracking-wider hover:bg-background/80">
                    <span className="mr-2 text-lg">G</span> Google
                </Button>
                <Button variant="outline" className="h-12 rounded-none border border-border font-mono text-[10px] uppercase tracking-wider hover:bg-background/80">
                    <span className="mr-2 text-lg"></span> Apple
                </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-8 text-center">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground font-mono tracking-widest text-[10px]">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* Method Toggle */}
            <div className="grid grid-cols-2 gap-0 mb-8 border border-border rounded-none p-1">
                <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-wider font-mono transition-all",
                        authMethod === 'email' ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Mail className="w-3 h-3" /> Email
                </button>
                <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={cn(
                        "flex items-center justify-center gap-2 py-2 text-[10px] uppercase tracking-wider font-mono transition-all",
                        authMethod === 'phone' ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Smartphone className="w-3 h-3" /> Phone
                </button>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-xs text-red-500 font-mono">{error}</p>
                </div>
            )}

            {/* Form */}
            <form action={login} className="space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2 group">
                        <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors h-10 placeholder:text-muted-foreground/30 font-mono text-sm"
                        />
                    </div>
                    <div className="space-y-2 group">
                        <Label htmlFor="password" className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                            Password
                        </Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="bg-transparent border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-foreground transition-colors h-10 placeholder:text-muted-foreground/30 font-mono text-sm tracking-widest"
                        />
                    </div>
                </div>

                <SubmitButton />

                <div className="text-center mt-8">
                    <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                        By continuing you agree to clear thinking
                    </p>
                </div>
            </form>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-foreground border-t-transparent animate-spin rounded-full" /></div>}>
            <LoginForm />
        </Suspense>
    )
}


