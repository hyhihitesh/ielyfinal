'use client'

import { motion } from 'framer-motion'

interface LevelDisplayProps {
    level: number
    progress: number // 0-100
    totalTasks: number
    nextLevelAt: number
}

export function LevelDisplay({ level, progress, totalTasks, nextLevelAt }: LevelDisplayProps) {
    return (
        <div className="rounded-xl p-4 border border-border bg-card relative overflow-hidden group">
            {/* Subtle hover glow */}
            <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-accent">{level}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Level</span>
                        <h3 className="text-sm font-semibold text-foreground leading-none mt-0.5">Founder</h3>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-lg font-semibold text-foreground tabular-nums">{totalTasks}</span>
                    <span className="text-xs text-muted-foreground ml-1">/ {nextLevelAt}</span>
                </div>
            </div>

            {/* Minimal Progress Bar */}
            <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-accent rounded-full"
                />
            </div>

            <p className="text-[10px] text-muted-foreground mt-2">
                Complete tasks to level up
            </p>
        </div>
    )
}
