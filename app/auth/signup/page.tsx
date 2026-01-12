'use client'

import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useFormStatus } from 'react-dom'
import { Suspense } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" variant="glow" className="w-full" size="lg" disabled={pending}>
            {pending ? 'Creating account...' : 'Create Account'}
        </Button>
    )
}

function SignupForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <Card className="border-border bg-card/50 shadow-none rounded-sm border-2">
            <CardHeader className="space-y-4 pb-4 border-b border-dashed border-border">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-sky rounded-none" />
                        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Identity Creation</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground/50">REF: P-NEW-01</span>
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Start your journey</CardTitle>
                    <CardDescription className="font-mono text-xs text-muted-foreground">
                        Define your core credentials to access the roadmap engine.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {/* Error Alert */}
                {error && (
                    <div className="mb-6 p-3 bg-destructive/5 border-l-2 border-destructive flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-mono text-[10px] uppercase text-destructive font-bold">Error Detected</p>
                            <p className="text-xs text-destructive/90">{error}</p>
                        </div>
                    </div>
                )}

                <form action={signup} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="font-mono text-xs uppercase text-muted-foreground">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="founder@example.com"
                            required
                            className="rounded-sm border-border focus:border-sky focus:ring-0 font-mono text-sm bg-background/50"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="font-mono text-xs uppercase text-muted-foreground">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="rounded-sm border-border focus:border-sky focus:ring-0 font-mono text-sm bg-background/50"
                        />
                        <p className="font-mono text-[10px] text-muted-foreground text-right pt-1">Min. 6 characters required</p>
                    </div>

                    <div className="space-y-2 py-2 border-l-2 border-sky/20 pl-4 my-2">
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-3 h-3 text-saffron" strokeWidth={3} />
                            <span className="font-medium text-xs">Personalized startup roadmap</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-3 h-3 text-sky" strokeWidth={3} />
                            <span className="font-medium text-xs">AI-powered analysis</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/80">
                            <CheckCircle2 className="w-3 h-3 text-saffron" strokeWidth={3} />
                            <span className="font-medium text-xs">Save progress securely</span>
                        </div>
                    </div>

                    <SubmitButton />
                </form>
            </CardContent>
            <CardFooter className="justify-center border-t border-dashed border-border pt-4 pb-4 bg-muted/5">
                <p className="text-xs text-muted-foreground font-mono">
                    Already Authenticated?{' '}
                    <Link href="/auth/login" className="text-foreground hover:text-accent font-bold transition-colors underline decoration-dotted underline-offset-4">
                        Access Portal
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={<div className="w-full h-96 animate-pulse glass rounded-xl" />}>
            <SignupForm />
        </Suspense>
    )
}


