'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCcw, Home } from 'lucide-react'
import { PielyMascot } from '@/components/brand/piely-mascot'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-150" />
                    <PielyMascot variant="thinking" size="lg" className="relative z-10" />
                </div>

                <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">Something went wrong</h1>
                <p className="mb-8 max-w-[500px] text-muted-foreground text-sm sm:text-base leading-relaxed">
                    Piely hit a snag. It's not you, it's us. The error has been logged and we're looking into it.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={reset} variant="glow" size="lg" className="w-full sm:w-auto">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>
                    <Button onClick={() => window.location.href = '/dashboard'} variant="outline" size="lg" className="w-full sm:w-auto bg-background/50">
                        <Home className="mr-2 h-4 w-4" />
                        Return to Dashboard
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-12 p-4 bg-red-500/5 border border-red-500/20 rounded-lg max-w-lg w-full text-left overflow-auto max-h-48 glass">
                        <p className="text-xs font-mono text-red-600 dark:text-red-400 break-all">
                            {error.message || "Unknown error occurred"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
