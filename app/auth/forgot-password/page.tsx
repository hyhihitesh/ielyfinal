'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    return (
        <Card className="border-border bg-card/50 shadow-none rounded-sm border-2 w-full">
            <CardHeader className="space-y-4 pb-4 border-b border-dashed border-border">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-saffron rounded-none" />
                        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Recovery Protocol</span>
                    </div>
                    <span className="font-mono text-xs text-muted-foreground/50">ID: RECOVER-01</span>
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">Reset Access</CardTitle>
                    <CardDescription className="font-mono text-xs text-muted-foreground">
                        Enter registered email to receive recovery token.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="font-mono text-xs uppercase text-muted-foreground">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="founder@example.com"
                            required
                            className="rounded-sm border-border focus:border-saffron focus:ring-0 font-mono text-sm bg-background/50"
                        />
                    </div>
                    <Button type="submit" variant="glow" className="w-full" size="lg">
                        Initiate Recovery
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="justify-center border-t border-dashed border-border pt-4 pb-4 bg-muted/5">
                <Link href="/auth/login" className="flex items-center gap-2 text-xs text-muted-foreground font-mono hover:text-foreground transition-colors group">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                    Return to Login
                </Link>
            </CardFooter>
        </Card>
    )
}
