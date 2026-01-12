"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { ScrambleText, ScrambleTextOnHover } from "@/components/landing/scramble-text"
import { AnimatedNoise } from "@/components/landing/animated-noise"
import { BitmapChevron } from "@/components/landing/bitmap-chevron"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sectionRef.current || !contentRef.current) return

        const content = contentRef.current
        const ctx = gsap.context(() => {
            gsap.to(content, {
                y: -100,
                opacity: 0,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                },
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="hero"
            className="relative min-h-screen flex items-center px-4 sm:px-6 md:pl-32 md:pr-16 py-20 md:py-0 pb-32"
        >
            <AnimatedNoise opacity={0.03} />

            {/* Top Right Login - hidden on mobile (MobileHeader has this) */}
            <div className="absolute top-6 right-6 z-10 hidden md:block">
                <Link
                    href="/auth/login"
                    className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                >
                    Login
                </Link>
            </div>

            {/* Left vertical label */}
            <div className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 hidden sm:block">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
                    DECISION
                </span>
            </div>

            {/* Main content */}
            <div ref={contentRef} className="flex-1 w-full max-w-6xl">
                <div className="relative">
                    <h1 className="text-[clamp(2.5rem,15vw,12rem)] sm:text-[clamp(3rem,12vw,12rem)] font-bold leading-[0.9] tracking-tighter text-brand">
                        <ScrambleText text="PIELY" duration={1.2} delayMs={200} />
                    </h1>
                </div>

                <h2 className="text-foreground text-[clamp(1.25rem,4vw,2.5rem)] mt-6 sm:mt-8 font-bold leading-tight max-w-3xl text-balance">
                    Make better startup decisions before they cost you months.
                </h2>

                <p className="mt-6 sm:mt-8 max-w-xl font-mono text-sm sm:text-base text-muted-foreground leading-relaxed">
                    Piely is a decision intelligence platform that helps founders turn confusion into clear next steps — using
                    real patterns, not generic advice.
                </p>

                <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <Link
                        href="/onboarding"
                        className="group inline-flex items-center gap-3 border-2 border-foreground/30 px-6 sm:px-8 py-3 sm:py-4 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-foreground hover:border-foreground hover:bg-foreground hover:text-background transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
                    >
                        <ScrambleTextOnHover text="Start Thinking Clearly" as="span" duration={0.5} />
                        <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
                    </Link>
                    <a
                        href="#how-it-works"
                        className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200 pt-2.5 sm:pt-3 w-full sm:w-auto text-center sm:text-left"
                    >
                        See How It Works →
                    </a>
                </div>
            </div>

            {/* Floating info tag */}
            <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="border border-border px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground bg-background/50 backdrop-blur-sm hover:border-foreground/50 transition-colors">
                    Free / Decision Platform
                </div>
            </div>
        </section>
    )
}
