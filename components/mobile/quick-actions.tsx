"use client"

import { motion } from "framer-motion"
import { Check, MessageSquare, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickActionsProps {
    onComplete?: () => void
    onAskAI?: () => void
    onAddTask?: () => void
    isCompleting?: boolean
    className?: string
}

export function QuickActions({
    onComplete,
    onAskAI,
    onAddTask,
    isCompleting = false,
    className
}: QuickActionsProps) {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className={cn(
                "fixed bottom-20 left-4 right-4 z-40 md:hidden",
                className
            )}
        >
            <div className="bg-card/95 backdrop-blur-md border border-border/50 rounded-2xl p-2 shadow-2xl flex items-center justify-around gap-2">
                {/* Complete Action */}
                <button
                    onClick={onComplete}
                    disabled={isCompleting}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all",
                        "bg-accent/10 text-accent hover:bg-accent/20 active:scale-95",
                        isCompleting && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                    <span className="text-sm font-semibold">Complete</span>
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-border/50" />

                {/* AI Help */}
                <button
                    onClick={onAskAI}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all text-foreground hover:bg-secondary active:scale-95"
                >
                    <MessageSquare className="w-5 h-5" strokeWidth={2} />
                    <span className="text-sm font-medium">AI Help</span>
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-border/50" />

                {/* Add Task */}
                <button
                    onClick={onAddTask}
                    className="flex items-center justify-center p-3 rounded-xl transition-all text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-95"
                >
                    <Plus className="w-5 h-5" strokeWidth={2.5} />
                </button>
            </div>
        </motion.div>
    )
}
