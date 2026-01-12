'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Check, Loader2 } from 'lucide-react';
import { saveProject } from '@/app/actions/project';
import { useRouter } from 'next/navigation';
import mixpanel from '@/lib/analytics';

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [idea, setIdea] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState({
        parsing: false,
        risks: false,
        milestones: false,
        canvas: false
    });

    useEffect(() => {
        mixpanel.track('Page View', { page_title: 'Onboarding' });
    }, []);

    const handleContinue = async () => {
        if (step === 1) {
            setStep(2); // Move to AI analysis step
            setIsAnalyzing(true);

            try {
                // Step 2a: Analyze Idea
                setProgress(p => ({ ...p, parsing: true }));
                const analyzeRes = await fetch('/api/ai/analyze', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idea }),
                });

                if (!analyzeRes.ok) throw new Error('Analysis failed');
                const profile = await analyzeRes.json();
                setProgress(p => ({ ...p, parsing: true, risks: true }));

                // Step 2b: Generate Roadmap
                setProgress(p => ({ ...p, milestones: true }));
                const generateRes = await fetch('/api/ai/generate-canvas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ idea, profile }),
                });

                if (!generateRes.ok) throw new Error('Generation failed');
                const roadmap = await generateRes.json();
                setProgress(p => ({ ...p, milestones: true, canvas: true }));

                // Step 2c: Save to Database
                const projectId = await saveProject(idea, profile, roadmap);

                mixpanel.track('Project Created', {
                    idea_length: idea.length,
                    milestones: roadmap.nodes?.length
                });

                setIsAnalyzing(false);
                setStep(3);

                // Redirect after success animation
                setTimeout(() => {
                    router.push(`/dashboard?project=${projectId}`);
                }, 2000);

            } catch (error: any) {
                console.error(error);
                setIsAnalyzing(false);
                setError(error.message || 'Logic engine failure');
                setStep(4); // Separate error step
            }
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

            {/* Progress Top Bar - Sharp & Tech */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
                <motion.div
                    className="h-full bg-saffron"
                    initial={{ width: '33%' }}
                    animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
            </div>

            <div className="flex min-h-screen items-center justify-center px-6 py-12 relative z-10">
                <div className="w-full max-w-2xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Header - Terminal Style */}
                                <div className="space-y-2 border-b border-dashed border-border pb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-saffron rounded-none" />
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Decision Framework</span>
                                    </div>
                                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                        Define Objective
                                    </h1>
                                    <p className="font-mono text-xs text-muted-foreground">
                                        Input project parameters for analysis.
                                    </p>
                                </div>

                                {/* Main content - Sharp Card */}
                                <div className="bg-card/50 rounded-sm border-2 border-border p-6 md:p-8 space-y-6 relative group focus-within:border-saffron/50 transition-colors">
                                    <div className="absolute top-0 right-0 px-2 py-1 bg-border/50 font-mono text-[9px] text-muted-foreground uppercase tracking-wider rounded-bl-sm">Mode: Objective_Capture</div>

                                    <div>
                                        <label className="block font-mono text-xs uppercase tracking-wide text-muted-foreground mb-3">
                                            Project Description / Intent
                                        </label>
                                        <textarea
                                            value={idea}
                                            onChange={(e) => setIdea(e.target.value)}
                                            placeholder="> Describe the startup or decision problem you are facing..."
                                            className="w-full h-32 md:h-40 px-4 py-3 rounded-sm border border-border bg-background/50 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-saffron focus:ring-1 focus:ring-saffron/20 transition-all resize-none font-mono text-sm leading-relaxed"
                                            autoFocus
                                        />
                                        <div className="flex justify-end mt-2">
                                            <span className="font-mono text-[10px] text-muted-foreground">
                                                CHARS: {idea.length.toString().padStart(3, '0')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-dashed border-border">
                                        <div className="space-y-2">
                                            <p className="font-mono text-[10px] uppercase text-sky">
                                                // Reference Examples
                                            </p>
                                            <ul className="font-mono text-xs text-muted-foreground space-y-1.5 pl-2 border-l border-border/50">
                                                <li>"SaaS for restaurant inventory management"</li>
                                                <li>"Validation for a new hardware device"</li>
                                                <li>"Market entry strategy for coffee shop"</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => router.push('/')}
                                        className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors px-4 py-3"
                                    >
                                        [ ESC ] Cancel
                                    </button>
                                    <button
                                        onClick={handleContinue}
                                        disabled={idea.length < 10}
                                        className="group inline-flex items-center gap-3 px-8 py-3 bg-foreground text-background font-mono text-xs uppercase tracking-widest rounded-sm hover:bg-foreground/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Analyze Decision
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8 max-w-xl mx-auto"
                            >
                                <div className="text-center space-y-4 border-b border-dashed border-border pb-8">
                                    <div className="mx-auto w-12 h-12 border-2 border-saffron border-t-transparent animate-spin rounded-full mb-6" />

                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                        Processing Logic
                                    </h1>
                                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest animate-pulse">
                                        mapping_market_logic...
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    {[
                                        { text: 'Parsing Intent & Context', done: progress.parsing },
                                        { text: 'Calibrating Risk Models', done: progress.risks },
                                        { text: 'Mapping Success Milestones', done: progress.milestones },
                                        { text: 'Generating Decision Canvas', done: progress.canvas },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.2, duration: 0.4 }}
                                            className="flex items-center gap-4 py-3 border-b border-border/30 last:border-0"
                                        >
                                            {item.done ? (
                                                <div className="w-4 h-4 bg-sky flex items-center justify-center rounded-sm">
                                                    <Check className="w-3 h-3 text-background" strokeWidth={3} />
                                                </div>
                                            ) : (
                                                <div className="w-4 h-4 border border-muted-foreground/30 animate-pulse bg-muted/10 rounded-sm" />
                                            )}
                                            <span className={`font-mono text-xs uppercase tracking-wide ${item.done ? 'text-muted-foreground' : 'text-foreground'}`}>
                                                {item.text}
                                            </span>
                                            {!item.done && <span className="ml-auto text-[10px] text-saffron animate-pulse">PROCESSING</span>}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="space-y-8 text-center"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 border-2 border-destructive bg-destructive/10 rounded-sm mb-6">
                                    <div className="w-8 h-8 bg-destructive" />
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                        Logic Error Detected
                                    </h1>
                                    <p className="font-mono text-[10px] text-destructive uppercase tracking-widest">
                                        EXCEPTION: {error || 'SYSTEM_FAILURE'}
                                    </p>
                                </div>

                                <div className="pt-8 flex justify-center">
                                    <button
                                        onClick={() => { setStep(1); setError(null); }}
                                        className="font-mono text-[10px] uppercase tracking-[0.3em] border border-border px-8 py-3 hover:bg-foreground hover:text-background transition-colors"
                                    >
                                        [ RE-INITIALIZE ]
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div >
    );
}
