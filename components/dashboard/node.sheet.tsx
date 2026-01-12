'use client'

import { useState, useEffect } from 'react'
import {
    Sheet,
    SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus, Sparkles, CheckCircle2, Circle } from 'lucide-react'
import { getTasks, addTask, toggleTask, Task } from '@/app/actions/task'
import { Database } from '@/lib/types/database'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { NodeChat } from './node.chat'
import { NodeGuide } from './node.guide'
import { cn } from '@/lib/utils'

type NodeData = Database['public']['Tables']['canvas_nodes']['Row']

interface NodeDetailSheetProps {
    isOpen: boolean
    onClose: () => void
    node: NodeData | null
}

const STATUS_STATES = ['open', 'active', 'waiting', 'paused', 'resolved']

export function NodeDetailSheet({ isOpen, onClose, node }: NodeDetailSheetProps) {
    // Logic State
    const [tasks, setTasks] = useState<Task[]>([])
    const [loadingTasks, setLoadingTasks] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState('')
    const [isAdding, setIsAdding] = useState(false)

    // UI State for "Context & Why" (Visual only for now, maps to description)
    const [contextWhy, setContextWhy] = useState(node?.description || '')

    useEffect(() => {
        if (node) {
            setContextWhy(node.description || '')
            setLoadingTasks(true)
            getTasks(node.id).then(setTasks).finally(() => setLoadingTasks(false))
        }
    }, [node])

    const handleToggle = async (taskId: string, current: boolean) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !current } : t))
        try { await toggleTask(taskId, !current) }
        catch (error) { setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: current } : t)) }
    }

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTaskTitle.trim() || !node) return
        setIsAdding(true)
        try {
            const newTask = await addTask(node.id, newTaskTitle)
            setTasks([...tasks, newTask as Task])
            setNewTaskTitle('')
        } catch (error) { console.error(error) }
        finally { setIsAdding(false) }
    }

    if (!node) return null

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="w-[500px] sm:w-[600px] p-0 flex flex-col bg-background border-l border-border h-full shadow-2xl">

                {/* Header: DECISION MODE */}
                <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-saffron" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Decision Mode</span>
                    </div>
                </div>

                <Tabs defaultValue="tasks" className="flex-1 flex flex-col min-h-0">

                    {/* Main Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-8 space-y-12">

                        {/* SECTION: Core Decision */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-baseline border-b border-border/50 pb-2 mb-4">
                                <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Core Decision</h3>
                                <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/30">ID: {node.id.slice(0, 8)}</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
                                {node.title}
                            </h1>
                        </div>

                        {/* SECTION: Current State */}
                        <div className="space-y-4">
                            <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Current State</h3>
                            <div className="flex flex-wrap gap-2">
                                {STATUS_STATES.map((state) => {
                                    const isActive = (node.status?.toLowerCase() || 'open') === state
                                    return (
                                        <button
                                            key={state}
                                            onClick={async () => {
                                                // Optimistic update if needed, but for now rely on revalidate
                                                try {
                                                    const { updateNodeStatus } = await import('@/app/actions/node')
                                                    await updateNodeStatus(node.id, state)
                                                } catch (e) {
                                                    console.error("Failed to update status", e)
                                                }
                                            }}
                                            className={cn(
                                                "px-4 py-1.5 rounded-sm border text-[10px] font-mono uppercase tracking-widest transition-all",
                                                isActive
                                                    ? 'bg-foreground text-background border-foreground'
                                                    : 'bg-transparent text-muted-foreground border-border/50 hover:border-border hover:text-foreground'
                                            )}
                                        >
                                            {state}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Tabs as "Sections" */}
                        <div className="space-y-4">
                            <TabsList className="bg-transparent p-0 justify-start gap-6 border-b border-border/40 w-full rounded-none h-auto pb-px">
                                <TabsTrigger value="tasks" className="rounded-none border-b-2 border-transparent data-[state=active]:border-saffron data-[state=active]:bg-transparent px-0 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground shadow-none">
                                    Key Assumptions
                                </TabsTrigger>
                                <TabsTrigger value="guide" className="rounded-none border-b-2 border-transparent data-[state=active]:border-saffron data-[state=active]:bg-transparent px-0 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground shadow-none">
                                    Context & Why
                                </TabsTrigger>
                                <TabsTrigger value="chat" className="rounded-none border-b-2 border-transparent data-[state=active]:border-saffron data-[state=active]:bg-transparent px-0 pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground data-[state=active]:text-foreground shadow-none">
                                    AI Challenge
                                </TabsTrigger>
                            </TabsList>

                            {/* TAB: TASKS (Assumptions) */}
                            <TabsContent value="tasks" className="mt-6 space-y-4 outline-none">
                                <div className="space-y-1">
                                    {loadingTasks ? (
                                        <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin" /></div>
                                    ) : tasks.length === 0 ? (
                                        <p className="text-xs text-muted-foreground/50 italic">No assumptions recorded yet.</p>
                                    ) : (
                                        tasks.map(task => (
                                            <div key={task.id} className="flex items-start gap-3 group py-1">
                                                <button onClick={() => handleToggle(task.id, task.completed)} className={cn("mt-1 transition-colors", task.completed ? "text-saffron" : "text-muted-foreground hover:text-foreground")}>
                                                    {task.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                                                </button>
                                                <span className={cn("text-sm transition-all font-medium", task.completed ? "text-muted-foreground line-through decoration-border" : "text-foreground")}>
                                                    {task.title}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <form onSubmit={handleAddTask} className="flex items-center gap-2 pt-2 border-t border-dashed border-border/40">
                                    <Plus className="w-3 h-3 text-muted-foreground" />
                                    <Input
                                        value={newTaskTitle}
                                        onChange={e => setNewTaskTitle(e.target.value)}
                                        placeholder="Add an assumption..."
                                        disabled={isAdding}
                                        className="h-8 border-0 bg-transparent p-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 text-xs"
                                    />
                                </form>
                            </TabsContent>

                            {/* TAB: GUIDE (Context - Swapped with Description Edit) */}
                            <TabsContent value="guide" className="mt-6 outline-none">
                                <div className="space-y-4">
                                    <Textarea
                                        value={contextWhy}
                                        onChange={(e) => setContextWhy(e.target.value)}
                                        onBlur={async () => {
                                            try {
                                                const { updateNodeDescription } = await import('@/app/actions/node')
                                                await updateNodeDescription(node.id, contextWhy)
                                            } catch (e: any) { console.error("Failed to save description", e) }
                                        }}
                                        placeholder="Why is this important right now?"
                                        className="min-h-[150px] resize-none border-0 bg-accent/5 rounded-sm p-4 text-sm leading-relaxed focus-visible:ring-0 focus-visible:border-l-2 focus-visible:border-saffron focus-visible:bg-accent/10 transition-all placeholder:text-muted-foreground/40"
                                    />
                                    {/* Link to formal guide below if needed */}
                                    <div className="pt-4 border-t border-border/20">
                                        <NodeGuide nodeId={node.id} nodeTitle={node.title} description={node.description || ''} content={node.content} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* TAB: CHAT (Challenge) */}
                            <TabsContent value="chat" className="mt-6 outline-none">
                                <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-sm">
                                    <h4 className="text-xs font-bold text-indigo-400 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-3 h-3" />
                                        Co-Founder Analysis
                                    </h4>
                                    <NodeChat context={node.title} />
                                </div>
                            </TabsContent>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-border bg-background/50 backdrop-blur-sm shrink-0">
                        <Button variant="outline" className="w-full h-12 border-dashed border-border hover:border-foreground/50 hover:bg-transparent font-mono text-xs uppercase tracking-widest rounded-sm" onClick={() => setNewTaskTitle('') /* logic placeholder */}>
                            <Plus className="w-3 h-3 mr-2" /> Add Next Step
                        </Button>
                    </div>

                </Tabs>
            </SheetContent>
        </Sheet>
    )
}
