'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Send, Loader2 } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { saveChat } from '@/app/actions/chat'
import type { UIMessage } from 'ai'

interface SidebarChatProps {
    projectId: string
    initialMessages: UIMessage[]
}

export function SidebarChat({ projectId, initialMessages }: SidebarChatProps) {
    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    const { messages, sendMessage, status } = useChat({
        id: projectId,
        messages: initialMessages,
        transport: new DefaultChatTransport({
            api: '/api/chat',
            body: {
                context: {
                    page: 'dashboard',
                    projectId,
                }
            }
        }),
    })

    const isLoading = status !== 'ready'
    const prevStatusRef = useRef<string>(status)
    const isSavingRef = useRef(false)

    // Save messages when response completes
    useEffect(() => {
        const wasLoading = prevStatusRef.current !== 'ready'
        const isNowReady = status === 'ready'
        prevStatusRef.current = status

        if (wasLoading && isNowReady && messages.length > 0 && !isSavingRef.current) {
            isSavingRef.current = true
            saveChat(projectId, messages)
                .catch(console.error)
                .finally(() => {
                    setTimeout(() => { isSavingRef.current = false }, 300)
                })
        }
    }, [status, messages, projectId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return
        sendMessage({ text: input })
        setInput('')
    }

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    return (
        <div className="flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden">
            {/* Header - Minimal */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
                <div>
                    <h4 className="text-sm font-medium text-foreground">AI Co-Founder</h4>
                    <p className="text-[10px] text-muted-foreground">
                        {isLoading ? 'Thinking...' : 'Ready to help'}
                    </p>
                </div>
                {isLoading && (
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                )}
            </div>

            {/* Messages - Clean */}
            <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-xs">Ask me anything about your project</p>
                        </div>
                    )}

                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={cn(
                                "flex",
                                m.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            <div
                                className={cn(
                                    "rounded-lg px-3 py-2 text-xs max-w-[90%]",
                                    m.role === 'user'
                                        ? 'bg-foreground text-background'
                                        : 'bg-muted text-foreground'
                                )}
                            >
                                {m.parts?.map((part, i) => {
                                    if (part.type === 'text') {
                                        return (
                                            <div
                                                key={i}
                                                className="prose prose-xs dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                                            >
                                                <ReactMarkdown>{part.text}</ReactMarkdown>
                                            </div>
                                        )
                                    }
                                    if (part.type.startsWith('tool-')) {
                                        return (
                                            <div key={i} className="text-[10px] text-muted-foreground italic">
                                                Processing...
                                            </div>
                                        )
                                    }
                                    return null
                                })}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-xs">Thinking...</span>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input - Refined */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border shrink-0">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        disabled={isLoading}
                        className="text-xs h-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-accent"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="h-9 w-9 shrink-0 bg-foreground hover:bg-foreground/90"
                    >
                        {isLoading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Send className="w-3.5 h-3.5" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
