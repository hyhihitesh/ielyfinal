import { createClient } from '@/lib/supabase/server'
import { getMindsFeed } from '@/app/actions/minds'
import { MindsFeed } from '@/components/minds/feed'
import { Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function MindsPage() {
    const posts = await getMindsFeed()

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-6">
                    <a
                        href="/dashboard"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
                    >
                        ← Back to Dashboard
                    </a>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Piely Minds</h1>
                        </div>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            See what other founders are building. Share your wins, get inspired, and benchmark your progress.
                        </p>
                    </div>
                </div>

                {/* Feed */}
                <MindsFeed posts={posts} />
            </div>
        </div>
    )
}
