"use client"

import Link from "next/link"
import { useRef, useEffect } from "react"
import { ScrambleTextOnHover } from "@/components/landing/scramble-text"
import { BitmapChevron } from "@/components/landing/bitmap-chevron"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function PricingSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sectionRef.current || !headerRef.current || !cardsRef.current) return

        const header = headerRef.current
        const cardsContainer = cardsRef.current

        const ctx = gsap.context(() => {
            gsap.from(header, {
                x: -60,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                },
            })

            const cards = cardsContainer.querySelectorAll(".pricing-card")
            if (cards.length > 0) {
                gsap.from(cards, {
                    y: 40,
                    opacity: 0,
                    duration: 0.9,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: cardsContainer,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="pricing" className="relative py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:pl-32 md:pr-16">
            <div ref={headerRef} className="mb-16 sm:mb-20 md:mb-24">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">07 / Pricing</span>
                <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight max-w-3xl bg-clip-text text-transparent bg-gradient-to-br from-[#FF6B35] to-[#87CEEB]">
                    Simple & Fair
                </h2>
            </div>

            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl">
                {/* Free Tier - Blueprint Style */}
                <div className="pricing-card border border-border bg-card/50 p-6 sm:p-8 md:p-10 rounded-sm relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-sky/10 to-transparent -mr-8 -mt-8 rounded-bl-full" />

                    <div className="mb-6 sm:mb-8 border-b border-dashed border-border pb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-sky rounded-none" />
                            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Solo Founder</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold tracking-tighter">Free</h3>
                        <p className="mt-2 text-muted-foreground text-sm max-w-[280px]">
                            Essential decision structures for early-stage validation.
                        </p>
                    </div>
                    <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 font-mono text-[10px] sm:text-xs uppercase tracking-wide">
                        <li className="flex items-center gap-3">
                            <div className="w-1 h-1 bg-sky" />
                            <span>Onboarding & Clarity</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-1 h-1 bg-sky" />
                            <span>Basic Strategy Map</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-1 h-1 bg-sky" />
                            <span>Early Risk Warnings</span>
                        </li>
                    </ul>
                    <Link
                        href="/onboarding"
                        className="group flex items-center justify-between border border-foreground/20 bg-transparent px-6 py-4 text-xs font-mono uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-all duration-300 rounded-sm"
                    >
                        <span>Start Free</span>
                        <BitmapChevron className="transition-transform duration-[400ms] group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Pro Tier - Saffron Accent */}
                <div className="pricing-card border-2 border-saffron/20 bg-gradient-to-b from-saffron/5 to-transparent p-6 sm:p-8 md:p-10 rounded-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-saffron" />
                    <div className="absolute top-4 right-4 animate-pulse">
                        <div className="px-2 py-0.5 border border-saffron/50 text-saffron font-mono text-[9px] uppercase tracking-widest">
                            Recommended
                        </div>
                    </div>

                    <div className="mb-6 sm:mb-8 border-b border-saffron/20 pb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-saffron rounded-none" />
                            <span className="font-mono text-[10px] uppercase tracking-widest text-saffron/80">Venture Ready</span>
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">Pro</h3>
                        <p className="mt-2 text-muted-foreground text-sm max-w-[280px]">
                            Advanced simulations and deeper failure pattern analysis.
                        </p>
                    </div>
                    <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 font-mono text-[10px] sm:text-xs uppercase tracking-wide text-foreground/80">
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-saffron rounded-none" />
                            <span>Deep Failure Patterns</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-saffron rounded-none" />
                            <span>Simulations & Scenarios</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-saffron rounded-none" />
                            <span>Weekly Execution Plans</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-saffron rounded-none" />
                            <span>Confidence Tracking</span>
                        </li>
                    </ul>
                    <a
                        href="/api/checkout?priceId=f1208a38-d267-4664-8bab-fbbf5ff877f1"
                        className="group flex items-center justify-between border border-saffron bg-saffron/10 px-6 py-4 text-xs font-mono uppercase tracking-widest text-saffron hover:bg-saffron hover:text-background transition-all duration-300 rounded-sm"
                    >
                        <span>Upgrade to Pro</span>
                        <BitmapChevron className="transition-transform duration-[400ms] group-hover:translate-x-1" />
                    </a>
                </div>
            </div>

            <p className="mt-8 sm:mt-12 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">
                No credit pricing. No thinking limits.
            </p>
        </section>
    )
}
