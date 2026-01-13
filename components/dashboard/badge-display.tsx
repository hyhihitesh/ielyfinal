'use client'

import { motion } from 'framer-motion'
import { BADGE_DEFINITIONS, UserBadge, BadgeType } from '@/lib/types/gamification'
import { Target, Zap, Trophy, Rocket, Flame, Dumbbell, Crown, Sparkles } from 'lucide-react'

const BADGE_ICONS: Record<BadgeType, React.ElementType> = {
    first_task: Target,
    task_master_10: Zap,
    task_master_50: Trophy,
    node_complete: Rocket,
    streak_3: Flame,
    streak_7: Dumbbell,
    streak_30: Crown,
    early_adopter: Sparkles,
}

interface BadgeDisplayProps {
    badges: UserBadge[]
    showEmpty?: boolean
}

interface BadgeItemProps {
    badgeType: BadgeType
    earnedAt?: string
    locked?: boolean
}

function BadgeItem({ badgeType, earnedAt, locked = false }: BadgeItemProps) {
    const definition = BADGE_DEFINITIONS[badgeType]

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: locked ? 1 : 1.05, y: locked ? 0 : -2 }}
            transition={{ duration: 0.2 }}
            className={`relative group ${locked ? 'opacity-30' : ''}`}
        >
            <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center text-lg
                ${locked
                    ? 'bg-muted border border-border'
                    : 'bg-accent/10 border border-accent/20'}
                transition-all duration-300
                ${!locked ? 'cursor-pointer hover:bg-accent/20' : 'cursor-default'}
                ${!locked ? 'cursor-pointer hover:bg-accent/20' : 'cursor-default'}
            `}>
                <div className={locked ? 'opacity-50 grayscale' : 'text-primary'}>
                    {(() => {
                        const Icon = BADGE_ICONS[badgeType]
                        return <Icon className="w-5 h-5" />
                    })()}
                </div>
            </div>

            {/* Minimal Tooltip */}
            <div className="absolute bottom-full left-1/2-translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                <div className="bg-card border border-border rounded-lg px-2.5 py-1.5 shadow-lg min-w-[100px] text-center">
                    <p className="font-medium text-xs text-foreground">{definition.name}</p>
                    {earnedAt && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(earnedAt).toLocaleDateString()}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

export function BadgeDisplay({ badges, showEmpty = false }: BadgeDisplayProps) {
    const earnedTypes = new Set(badges.map(b => b.badge_type))

    const displayBadges = showEmpty
        ? Object.keys(BADGE_DEFINITIONS) as BadgeType[]
        : badges.map(b => b.badge_type)

    if (displayBadges.length === 0) {
        return (
            <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground text-center">
                    No badges earned yet. Complete tasks to unlock!
                </p>
            </div>
        )
    }

    return (
        <div className="rounded-lg border border-border bg-card p-3 space-y-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Achievements</h3>
            <div className="flex flex-wrap gap-2">
                {displayBadges.map((badgeType) => {
                    const badge = badges.find(b => b.badge_type === badgeType)
                    return (
                        <BadgeItem
                            key={badgeType}
                            badgeType={badgeType}
                            earnedAt={badge?.earned_at}
                            locked={!earnedTypes.has(badgeType)}
                        />
                    )
                })}
            </div>
        </div>
    )
}
