// Badge type definitions for gamification

export type BadgeType =
    | 'first_task'      // Complete your first task
    | 'task_master_10'  // Complete 10 tasks
    | 'task_master_50'  // Complete 50 tasks
    | 'node_complete'   // Complete your first node/milestone
    | 'streak_3'        // 3-day streak
    | 'streak_7'        // 7-day streak
    | 'streak_30'       // 30-day streak
    | 'early_adopter'   // Signed up in beta

export interface BadgeDefinition {
    type: BadgeType
    name: string
    description: string
    icon: string // Emoji for now, can be replaced with icons
    color: string // Tailwind gradient
}

export const BADGE_DEFINITIONS: Record<BadgeType, BadgeDefinition> = {
    first_task: {
        type: 'first_task',
        name: 'First Step',
        description: 'Completed your first task',
        icon: '🎯',
        color: 'from-green-500 to-emerald-600',
    },
    task_master_10: {
        type: 'task_master_10',
        name: 'Task Master',
        description: 'Completed 10 tasks',
        icon: '⚡',
        color: 'from-yellow-500 to-amber-600',
    },
    task_master_50: {
        type: 'task_master_50',
        name: 'Productivity Pro',
        description: 'Completed 50 tasks',
        icon: '🏆',
        color: 'from-purple-500 to-violet-600',
    },
    node_complete: {
        type: 'node_complete',
        name: 'Milestone Maker',
        description: 'Completed your first milestone',
        icon: '🚀',
        color: 'from-blue-500 to-indigo-600',
    },
    streak_3: {
        type: 'streak_3',
        name: 'Getting Started',
        description: '3-day activity streak',
        icon: '🔥',
        color: 'from-orange-500 to-red-500',
    },
    streak_7: {
        type: 'streak_7',
        name: 'Week Warrior',
        description: '7-day activity streak',
        icon: '💪',
        color: 'from-red-500 to-pink-600',
    },
    streak_30: {
        type: 'streak_30',
        name: 'Unstoppable',
        description: '30-day activity streak',
        icon: '👑',
        color: 'from-amber-400 to-yellow-500',
    },
    early_adopter: {
        type: 'early_adopter',
        name: 'Early Adopter',
        description: 'Joined during beta',
        icon: '✨',
        color: 'from-cyan-500 to-teal-600',
    },
}

// Badge earned by user (matches DB schema)
export interface UserBadge {
    id: string
    user_id: string
    badge_type: BadgeType
    earned_at: string
}
