import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Send, Loader2, ArrowDown } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    const [showScrollButton, setShowScrollButton] = useState(false)
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
                    system: "You are a sassy, direct, and extremely helpful AI Co-Founder. You help with startup validation.", // Reinforce persona from screenshot
                }
            }
        }),
    })

    const isLoading = status !== 'ready'
    const prevStatusRef = useRef<string>(status)
    const isSavingRef = useRef(false)

    // Save messages logic...
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

    // Auto-scroll when new messages appear
    useEffect(() => {
        if (scrollRef.current) {
            const { scrollHeight, clientHeight } = scrollRef.current;
            // Only auto-scroll if we were already near bottom OR it's a new message generation
            scrollRef.current.scrollTop = scrollHeight;
        }
    }, [messages, status]) // Depend on status too so it scrolls while generating

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
            setShowScrollButton(!isNearBottom)
        }
    }

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div className="flex flex-col h-full rounded-xl border border-border bg-card overflow-hidden shadow-sm relative">
            {/* Header */}
            {/* Header Removed */}

            {/* Messages Area - Using native div for scroll control */}
            <div
                className="flex-1 px-4 py-3 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent relative"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                <div className="space-y-4 pb-4">
                    {messages.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-xl">👋</span>
                            </div>
                            <p className="text-xs max-w-[200px] leading-relaxed">
                                I'm your AI Co-Founder. Ask me to validate ideas, find competitors, or just roast your pitch.
                            </p>
                        </div>
                    )}

                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={cn(
                                "flex w-full",
                                m.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                        >
                            <div
                                className={cn(
                                    "rounded-2xl px-4 py-3 text-xs max-w-[85%] break-words whitespace-pre-wrap shadow-sm",
                                    m.role === 'user'
                                        ? 'bg-foreground text-background rounded-tr-sm'
                                        : 'bg-muted/50 text-foreground border border-border rounded-tl-sm'
                                )}
                            >
                                {m.parts?.map((part, i) => {
                                    if (part.type === 'text') {
                                        return (
                                            <div
                                                key={i}
                                                className="prose prose-xs dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 break-words"
                                            >
                                                <ReactMarkdown>{part.text}</ReactMarkdown>
                                            </div>
                                        )
                                    }
                                    if (part.type.startsWith('tool-')) {
                                        return (
                                            <div key={i} className="text-[10px] text-muted-foreground italic flex items-center gap-2 my-1">
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                Running tool: {part.type}
                                            </div>
                                        )
                                    }
                                    return null
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Scroll Button - Positioned absolutely relative to the main card */}
            {showScrollButton && (
                <div className="absolute bottom-[4.5rem] right-4 z-50">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full shadow-md animate-in fade-in zoom-in duration-200 opacity-90 hover:opacity-100 bg-background border border-border"
                        onClick={scrollToBottom}
                    >
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-border shrink-0 bg-background">
                <div className="flex gap-2 items-end">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="text-xs min-h-[40px] py-3 bg-muted/30 border-border focus-visible:ring-1 focus-visible:ring-accent resize-none"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className="h-10 w-10 shrink-0 bg-foreground hover:bg-foreground/90 rounded-lg transition-all"
                    >
                        {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}

