'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Sparkles } from 'lucide-react';
import { generateNodeGuide } from '@/app/actions/content';
// Note: We might need a markdown renderer here, e.g. react-markdown
// For MVP, we'll display text with basic formatting (whitespace-pre-wrap)

interface NodeGuideProps {
    nodeId: string;
    nodeTitle: string;
    description: string;
    content: string | null;
}

export function NodeGuide({ nodeId, nodeTitle, description, content }: NodeGuideProps) {
    const [guideContent, setGuideContent] = useState(content);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Call server action
            const newContent = await generateNodeGuide(nodeId, nodeTitle, description, "Startup Context");
            setGuideContent(newContent);
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!guideContent) {
        return (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-6 space-y-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">No guide used yet</h3>
                    <p className="text-sm text-slate-500">Generate a step-by-step tutorial for this specific task.</p>
                </div>
                <Button onClick={handleGenerate} disabled={isGenerating} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Writing Guide...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generate Guide
                        </>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-1">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Guide: {nodeTitle}</h3>
                <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Regenerate'}
                </Button>
            </div>
            <div className="prose dark:prose-invert prose-sm max-w-none bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 whitespace-pre-wrap">
                {guideContent}
            </div>
        </div>
    );
}
