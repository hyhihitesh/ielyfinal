'use client'

import { useState } from 'react'
import { Bell, Lightbulb, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Database } from '@/lib/types/database'
import { markInsightRead } from '@/app/actions/insights'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

type Insight = Database['public']['Tables']['project_insights']['Row']

interface InsightsFeedProps {
    insights: Insight[]
}

export function InsightsFeed({ insights }: InsightsFeedProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [optimisticReadIds, setOptimisticReadIds] = useState<Set<string>>(new Set())

    // Filter unread or recently read (optimistic) logic could go here, 
    // but we'll show all and just style read ones differently for now or hide them.
    // Actually, usually a notification feed shows unread first.

    // Sort: Unread first, then by date descending.
    const sortedInsights = [...insights].sort((a, b) => {
        const aRead = a.is_read || optimisticReadIds.has(a.id)
        const bRead = b.is_read || optimisticReadIds.has(b.id)
        if (aRead === bRead) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }
        return aRead ? 1 : -1
    })

    const unreadCount = insights.filter(i => !i.is_read && !optimisticReadIds.has(i.id)).length

    const handleMarkRead = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setOptimisticReadIds(prev => new Set(prev).add(id))
        await markInsightRead(id)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 mr-4" align="end">
                <div className="p-3 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            Insights & Actions
                        </h4>
                        <span className="text-xs text-muted-foreground">
                            {unreadCount} unread
                        </span>
                    </div>
                </div>

                <ScrollArea className="h-[300px]">
                    {sortedInsights.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center text-muted-foreground gap-2">
                            <Check className="w-8 h-8 opacity-20" />
                            <p className="text-sm">You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {sortedInsights.map((insight) => {
                                const isRead = insight.is_read || optimisticReadIds.has(insight.id)
                                return (
                                    <div
                                        key={insight.id}
                                        className={cn(
                                            "p-4 border-b border-border/50 transition-colors hover:bg-muted/50 cursor-pointer relative group",
                                            isRead ? "opacity-60 bg-muted/20" : "bg-background"
                                        )}
                                    >
                                        <div className="flex gap-3">
                                            <div className="mt-1">
                                                {/* Icon based on type */}
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    insight.type === 'warning' ? "bg-red-500" : "bg-blue-500"
                                                )} />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm leading-snug">{insight.content}</p>

                                                {/* Action Button if available */}
                                                {insight.action_url && (
                                                    <Button
                                                        variant="link"
                                                        size="sm"
                                                        className="h-auto p-0 text-indigo-400 mt-1"
                                                    >
                                                        {insight.action_label || 'View'} →
                                                    </Button>
                                                )}

                                                <p className="text-[10px] text-muted-foreground pt-1">
                                                    {formatDistanceToNow(new Date(insight.created_at), { addSuffix: true })}
                                                </p>
                                            </div>

                                            {/* Mark Read Button (Visible on hover if unread) */}
                                            {!isRead && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 absolute top-2 right-2"
                                                    onClick={(e) => handleMarkRead(insight.id, e)}
                                                >
                                                    <X className="w-3 h-3 text-muted-foreground" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}
