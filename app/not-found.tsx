import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'
import { PielyMascot } from '@/components/brand/piely-mascot'

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center overflow-hidden relative">
            {/* Distinctive Background Layers */}
            <div className="bg-noise absolute inset-0 z-0 opacity-40 mix-blend-overlay" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-saffron/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-sky/20 blur-xl rounded-full scale-110" />
                    <PielyMascot variant="sleeping" size="lg" className="relative z-10 opacity-90" />
                </div>

                <div className="space-y-2 mb-6">
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-saffron to-sky">
                        404
                    </h1>
                    <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
                        Off the map
                    </h2>
                </div>

                <p className="mb-10 max-w-[450px] text-muted-foreground text-sm sm:text-base leading-relaxed">
                    We've searched the known universe, but this page seems to be missing. It might have pivoted or shut down.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button asChild variant="glow" size="lg" className="w-full sm:w-auto">
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <Button asChild variant="glass" size="lg" className="w-full sm:w-auto">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
