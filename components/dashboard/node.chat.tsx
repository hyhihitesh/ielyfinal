'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@ai-sdk/react';

export function NodeChat({ context }: { context: string }) {
    // Official strict usage for @ai-sdk/react v3+:
    // - Manage input manually.
    // - Use 'sendMessage' instead of 'append'.
    // - Use 'status' to check loading state.
    const { messages, sendMessage, status } = useChat({
        api: '/api/ai/chat',
        body: { context },
    } as any);

    // Derived state
    const isLoading = status === 'submitted' || status === 'streaming';

    // Manual input state
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const content = input;
        setInput('');

        // Send the message
        // API SDK v6 might expect a message object or strict structure
        sendMessage({
            role: 'user',
            parts: [{ type: 'text', text: content }]
        } as any);
    };

    // Helper to extract text from Vercel AI SDK v6 UIMessage
    const getMessageText = (m: any) => {
        if (typeof m.content === 'string') return m.content;
        if (Array.isArray(m.parts)) {
            return m.parts
                .filter((p: any) => p.type === 'text')
                .map((p: any) => p.text)
                .join('');
        }
        return '';
    };

    return (
        <div className="flex flex-col h-[400px]">
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm text-slate-800 dark:text-slate-200">
                                Hi! I'm your co-founder. Ask me anything about <strong>{context}</strong>.
                            </div>
                        </div>
                    )}

                    {messages.map((m) => (
                        <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
                                }`}>
                                {m.role === 'assistant' ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${m.role === 'assistant'
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                                : 'bg-indigo-600 text-white'
                                }`}>
                                {getMessageText(m)}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm text-slate-500">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <form onSubmit={onSubmit} className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <Input
                    placeholder="Ask a question..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
