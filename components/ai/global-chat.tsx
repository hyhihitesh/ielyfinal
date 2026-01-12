'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Bot, MessageSquare, Send, X, ChevronDown, Loader2 } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { PielyMascot } from '@/components/brand/piely-mascot'

export function GlobalChat() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const pathname = usePathname()
    // ... existing hook code ...
    const scrollRef = useRef<HTMLDivElement>(null)

    // AI SDK v6 pattern with DefaultChatTransport
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
            body: {
                context: {
                    page: pathname
                }
            }
        }),
    })

    const isLoading = status !== 'ready'

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        sendMessage({ text: input })
        setInput('')
    }

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[380px] h-[600px] bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden ring-1 ring-border/50"
                    >
                        {/* Header */}
                        <div className="p-4 border-b bg-secondary/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-saffron/20 blur-xl rounded-full" />
                                    <PielyMascot variant="happy" size="sm" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Piely Companion</h3>
                                    <p className="text-xs text-muted-foreground">Always here to help</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.length === 0 && (
                                    <div className="text-center text-muted-foreground text-sm py-8 space-y-4 flex flex-col items-center">
                                        <PielyMascot variant="happy" size="xl" priority />
                                        <div className="space-y-1">
                                            <p className="font-medium text-foreground">Hi! I'm Piely.</p>
                                            <p>I can help you build your roadmap.</p>
                                        </div>
                                        <div className="flex gap-2 justify-center flex-wrap">
                                            <button
                                                onClick={() => sendMessage({ text: "Help me validate my idea" })}
                                                className="text-xs bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors"
                                            >
                                                Validate Idea
                                            </button>
                                            <button
                                                onClick={() => sendMessage({ text: "Add a marketing step" })}
                                                className="text-xs bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors"
                                            >
                                                Add Step
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={cn(
                                            "flex w-full items-start gap-2",
                                            m.role === 'user' ? "flex-row-reverse" : "flex-row"
                                        )}
                                    >
                                        <div className={cn(
                                            "rounded-lg px-3 py-2 text-sm max-w-[80%]",
                                            m.role === 'user'
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted"
                                        )}>
                                            {/* Render message parts (AI SDK v6 pattern) */}
                                            {m.parts?.map((part, i) => {
                                                switch (part.type) {
                                                    case 'text':
                                                        return <div key={i} className="prose prose-sm dark:prose-invert">{part.text}</div>
                                                    case 'tool-invocation':
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-ignore - AI SDK v6 type narrowing is complex here
                                                        const invocation = part.toolInvocation;
                                                        const toolName = invocation?.toolName || 'Unknown Tool';
                                                        const state = invocation?.state || 'loading';

                                                        return (
                                                            <div key={i} className="italic opacity-80 text-xs">
                                                                🤖 {state === 'result' ? '✅' : '⏳'} {toolName}
                                                            </div>
                                                        )
                                                    default:
                                                        return null
                                                }
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs pl-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Thinking...
                                    </div>
                                )}
                            </div>
                        </ScrollArea>

                        {/* Input */}
                        <div className="p-4 border-t bg-background">
                            <form
                                onSubmit={handleSubmit}
                                className="flex gap-2"
                            >
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for help or changes..."
                                    className="flex-1"
                                    disabled={isLoading}
                                />
                                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                layout
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                    "flex items-center justify-center rounded-full shadow-lg transition-colors border",
                    isOpen
                        ? "w-12 h-12 bg-background hover:bg-muted text-foreground"
                        : "w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white"
                )}
            >
                {isOpen ? <ChevronDown className="w-6 h-6" /> : <MessageSquare className="w-7 h-7" />}
            </motion.button>
        </div>
    )
}
