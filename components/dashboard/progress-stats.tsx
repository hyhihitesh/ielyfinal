'use client'

import { CheckCircle2, Target, Flame, TrendingUp } from 'lucide-react'
import { UserStats } from '@/app/actions/analytics'

interface ProgressStatsProps {
    stats: UserStats
}

interface StatCardProps {
    icon: React.ReactNode
    label: string
    value: string | number
    subValue?: string
}

function StatCard({ icon, label, value, subValue }: StatCardProps) {
    return (
        <div className="group relative bg-card border border-border rounded-lg p-3 transition-all duration-300 hover:border-accent/30">
            <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-muted text-muted-foreground group-hover:bg-accent/10 group-hover:text-accent transition-colors duration-300">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-base font-semibold text-foreground tabular-nums">{value}</span>
                        {subValue && (
                            <span className="text-[10px] text-muted-foreground">{subValue}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function ProgressStats({ stats }: ProgressStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            <StatCard
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                label="Tasks"
                value={stats.completedTasks}
                subValue={`/ ${stats.totalTasks}`}
            />
            <StatCard
                icon={<TrendingUp className="w-3.5 h-3.5" />}
                label="Progress"
                value={`${stats.completionRate}%`}
            />
            <StatCard
                icon={<Target className="w-3.5 h-3.5" />}
                label="Milestones"
                value={stats.completedNodes}
                subValue={`/ ${stats.totalNodes}`}
            />
            <StatCard
                icon={<Flame className="w-3.5 h-3.5" />}
                label="Streak"
                value={stats.currentStreak}
                subValue="days"
            />
        </div>
    )
}
