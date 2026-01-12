'use client'

import { motion } from 'framer-motion'
import { Rocket, ThumbsUp, User } from 'lucide-react'

export interface MindsPost {
    id: string
    snapshot: {
        title: string
        status: string
        industry?: string
        stage?: string
        completed_at?: string
    }
    likes: number
    createdAt: string
    author: {
        name: string
        avatar: string | null
        isAnonymous: boolean
    }
}

export function PostCard({ post }: { post: MindsPost }) {
    const { snapshot, author } = post

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-xl bg-background/40 backdrop-blur-md border border-border/50 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-saffron/10 hover:border-saffron/30"
        >
            {/* Header: Industry & Stage */}
            <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-full bg-saffron/10 text-saffron text-[10px] font-bold uppercase tracking-wider border border-saffron/20">
                    {snapshot.industry || 'Tech'}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-sky/10 text-sky text-[10px] font-bold uppercase tracking-wider border border-sky/20">
                    {snapshot.stage || 'Build'}
                </span>
                <span className="ml-auto text-[10px] font-mono text-muted-foreground/70">
                    {new Date(post.createdAt).toLocaleDateString()}
                </span>
            </div>

            {/* Content: Node Title */}
            <div className="mb-5">
                <div className="flex items-start gap-3 mb-2">
                    <div className="mt-1 p-1.5 rounded-full bg-emerald-500/10 shrink-0">
                        <Rocket className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-brand transition-colors">
                            {snapshot.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Achieved a key milestone on the roadmap.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer: Author & Interaction */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/30">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-saffron to-sky p-0.5">
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                            {author.avatar ? (
                                <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-3.5 h-3.5 text-muted-foreground" />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">
                            {author.name}
                        </span>
                        {author.isAnonymous && (
                            <span className="text-[9px] text-muted-foreground uppercase tracking-widest">Verified</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-sky transition-colors cursor-pointer bg-secondary/50 px-2 py-1 rounded-full">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{post.likes}</span>
                </div>
            </div>
        </motion.div>
    )
}
