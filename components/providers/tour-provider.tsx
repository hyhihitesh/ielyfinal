'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Tour step definition
export interface TourStep {
    target: string // CSS selector or 'center' for modal
    title: string
    description: string
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

// Default tour steps for dashboard
export const DASHBOARD_TOUR_STEPS: TourStep[] = [
    {
        target: 'center',
        title: 'Welcome to Piely',
        description: 'Let me show you around your startup dashboard. This quick tour will help you get started.',
        position: 'center',
    },
    {
        target: '[data-tour="progress-stats"]',
        title: 'Track Your Progress',
        description: 'Here you can see your task completion rate, milestones achieved, and activity streaks.',
        position: 'right',
    },
    {
        target: '[data-tour="canvas"]',
        title: 'Your Roadmap Canvas',
        description: 'This is your startup roadmap. Each node represents a milestone. Click any node to see tasks and get AI guidance.',
        position: 'left',
    },
    {
        target: '[data-tour="badges"]',
        title: 'Earn Achievements',
        description: 'Complete tasks to unlock badges and track your journey. More badges = more progress!',
        position: 'right',
    },
]

// Tour context
interface TourContextType {
    isActive: boolean
    currentStep: number
    steps: TourStep[]
    startTour: () => void
    endTour: () => void
    nextStep: () => void
    prevStep: () => void
}

const TourContext = createContext<TourContextType | null>(null)

export function useTour() {
    const context = useContext(TourContext)
    if (!context) {
        throw new Error('useTour must be used within a TourProvider')
    }
    return context
}

// Tour Provider Component
interface TourProviderProps {
    children: ReactNode
    steps?: TourStep[]
    autoStart?: boolean
    storageKey?: string
}

export function TourProvider({
    children,
    steps = DASHBOARD_TOUR_STEPS,
    autoStart = true,
    storageKey = 'piely-tour-completed'
}: TourProviderProps) {
    const [isActive, setIsActive] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    // Check if tour was already completed
    useEffect(() => {
        if (autoStart && typeof window !== 'undefined') {
            const completed = localStorage.getItem(storageKey)
            if (!completed) {
                // Small delay to let the page render
                const timer = setTimeout(() => setIsActive(true), 1000)
                return () => clearTimeout(timer)
            }
        }
    }, [autoStart, storageKey])

    const startTour = useCallback(() => {
        setCurrentStep(0)
        setIsActive(true)
    }, [])

    const endTour = useCallback(() => {
        setIsActive(false)
        setCurrentStep(0)
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, 'true')
        }
    }, [storageKey])

    const nextStep = useCallback(() => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            endTour()
        }
    }, [currentStep, steps.length, endTour])

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }, [currentStep])

    const step = steps[currentStep]

    const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})

    // Calculate position when step changes
    useEffect(() => {
        if (!isActive || !step || typeof document === 'undefined') return

        if (step.position === 'center') {
            setTooltipStyle({
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed'
            })
            return
        }

        const targetEl = document.querySelector(step.target)
        if (!targetEl) {
            // Fallback to center if target not found
            setTooltipStyle({
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                position: 'fixed'
            })
            return
        }

        const rect = targetEl.getBoundingClientRect()
        const GAP = 12

        // Simple positioning logic
        let style: React.CSSProperties = { position: 'fixed' }

        switch (step.position) {
            case 'top':
                style.top = rect.top - GAP
                style.left = rect.left + rect.width / 2
                style.transform = 'translate(-50%, -100%)'
                break
            case 'bottom':
                style.top = rect.bottom + GAP
                style.left = rect.left + rect.width / 2
                style.transform = 'translate(-50%, 0)'
                break
            case 'left':
                style.top = rect.top + rect.height / 2
                style.left = rect.left - GAP
                style.transform = 'translate(-100%, -50%)'
                break
            case 'right':
                style.top = rect.top + rect.height / 2
                style.left = rect.right + GAP
                style.transform = 'translate(0, -50%)'
                break
            default: // Default to bottom
                style.top = rect.bottom + GAP
                style.left = rect.left + rect.width / 2
                style.transform = 'translate(-50%, 0)'
        }
        setTooltipStyle(style)

    }, [currentStep, isActive, step])

    return (
        <TourContext.Provider value={{ isActive, currentStep, steps, startTour, endTour, nextStep, prevStep }}>
            {children}

            <AnimatePresence>
                {isActive && step && (
                    <>
                        {/* Overlay - Optional: Add hole punch later, just dim for now */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-[100]"
                            onClick={endTour}
                        />

                        {/* Tooltip */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            style={tooltipStyle}
                            className="z-[101] bg-card border border-border rounded-xl p-6 shadow-2xl max-w-sm w-[320px]"
                        >
                            {/* Close button */}
                            <button
                                onClick={endTour}
                                className="absolute top-3 right-3 p-1 rounded-md hover:bg-secondary transition-colors"
                            >
                                <X className="w-4 h-4 text-muted-foreground" />
                            </button>

                            {/* Content */}
                            <h3 className="text-lg font-bold text-foreground mb-2 pr-6">{step.title}</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{step.description}</p>

                            {/* Progress dots */}
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-1.5">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentStep ? 'bg-primary' : 'bg-muted'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Navigation */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={prevStep}
                                        disabled={currentStep === 0}
                                        className="h-8 px-2 text-xs"
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={nextStep}
                                        className="h-8 px-3 text-xs gap-1"
                                    >
                                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                        {currentStep < steps.length - 1 && <ChevronRight className="w-3 h-3" />}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </TourContext.Provider>
    )
}
