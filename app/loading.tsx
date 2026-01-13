import { Logo } from '@/components/ui/logo'

export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Logo className="h-12 w-12 animate-pulse" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading...</p>
            </div>
        </div>
    )
}
