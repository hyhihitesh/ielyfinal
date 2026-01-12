import { PielyMascot } from "@/components/brand/piely-mascot"
import Link from "next/link"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Distinctive Background Layers */}
            <div className="bg-noise absolute inset-0 z-0 opacity-40 mix-blend-overlay" />

            {/* Top Right Orb (Sky) */}
            <div className="absolute -top-[10%] -right-[10%] w-[50vh] h-[50vh] bg-sky/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Bottom Left Orb (Saffron) */}
            <div className="absolute -bottom-[10%] -left-[10%] w-[50vh] h-[50vh] bg-saffron/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-md px-4">
                <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Link href="/" className="mb-6 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-saffron/20 blur-xl rounded-full group-hover:bg-saffron/30 transition-all duration-500" />
                            <PielyMascot variant="happy" size="md" className="relative z-10" />
                        </div>
                    </Link>
                </div>

                {children}

                <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    <p className="text-xs text-muted-foreground/60 font-mono uppercase tracking-widest">
                        Decision Intelligence for Founders
                    </p>
                </div>
            </div>
        </div>
    )
}
