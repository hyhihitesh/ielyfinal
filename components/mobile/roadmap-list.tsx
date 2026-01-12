"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Lock, PlayCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoadmapNode {
    id: string
    dbId: string
    label: string
    description: string
    status: "locked" | "current" | "complete"
    progress?: number
}

interface RoadmapListProps {
    nodes: RoadmapNode[]
    onNodeClick: (node: RoadmapNode) => void
    className?: string
}

export function RoadmapList({ nodes, onNodeClick, className }: RoadmapListProps) {
    const getStatusIcon = (status: RoadmapNode["status"]) => {
        switch (status) {
            case "complete":
                return <CheckCircle2 className="w-5 h-5 text-accent" strokeWidth={2} />
            case "current":
                return <PlayCircle className="w-5 h-5 text-accent" strokeWidth={2} />
            case "locked":
                return <Lock className="w-5 h-5 text-muted-foreground" strokeWidth={2} />
        }
    }

    const getStatusStyles = (status: RoadmapNode["status"]) => {
        switch (status) {
            case "complete":
                return "border-accent/30 bg-accent/5"
            case "current":
                return "border-accent bg-accent/10 shadow-[0_0_20px_-5px_rgba(255,107,53,0.15)]"
            case "locked":
                return "border-border/40 bg-secondary/20 opacity-60"
        }
    }

    return (
        <div className={cn("space-y-3 pb-24", className)}>
            {nodes.map((node, index) => (
                <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <button
                        onClick={() => onNodeClick(node)}
                        disabled={node.status === "locked"}
                        className={cn(
                            "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                            "active:scale-[0.98]",
                            getStatusStyles(node.status),
                            node.status !== "locked" && "hover:border-accent/50"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            {/* Status Icon */}
                            <div className="mt-0.5 shrink-0">
                                {getStatusIcon(node.status)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-bold text-foreground truncate">
                                        {node.label}
                                    </h3>
                                    {node.status !== "locked" && (
                                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                    {node.description}
                                </p>

                                {/* Progress bar for current node */}
                                {node.status === "current" && node.progress !== undefined && (
                                    <div className="mt-3">
                                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                            <span>Progress</span>
                                            <span>{Math.round(node.progress)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-premium rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${node.progress}%` }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Step indicator */}
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-border hidden" />
                    </button>

                    {/* Connector line */}
                    {index < nodes.length - 1 && (
                        <div className="flex justify-center py-1">
                            <div className={cn(
                                "w-0.5 h-4",
                                node.status === "complete" ? "bg-accent/30" : "bg-border/30"
                            )} />
                        </div>
                    )}
                </motion.div>
            ))}

            {nodes.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No milestones yet.</p>
                </div>
            )}
        </div>
    )
}
