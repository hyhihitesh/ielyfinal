"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { BitmapChevron } from "@/components/landing/bitmap-chevron"

gsap.registerPlugin(ScrollTrigger)

export function ComparisonSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<HTMLDivElement>(null)

    const comparisons = [
        { chatgpt: "Answers questions", piely: "Structures decisions" },
        { chatgpt: "Text conversations", piely: "Visual decision map" },
        { chatgpt: "No stop conditions", piely: "Built-in stop & pivot logic" },
        { chatgpt: "No memory of attempts", piely: "Tracks your decision history" },
    ]

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

            const cards = cardsContainer.querySelectorAll(".comparison-card")
            if (cards.length > 0) {
                gsap.from(cards, {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
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
        <section
            ref={sectionRef}
            id="comparison"
            className="relative py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:pl-32 md:pr-16 bg-background border-y border-foreground/5"
        >
            <div ref={headerRef} className="mb-16 sm:mb-20 md:mb-24">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">04 / Comparison</span>
                <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight max-w-3xl bg-clip-text text-transparent bg-gradient-to-br from-[#FF6B35] to-[#87CEEB]">
                    Why Not Just Use ChatGPT?
                </h2>
                <p className="mt-6 sm:mt-8 font-mono text-xs sm:text-sm text-muted-foreground max-w-xl">
                    ChatGPT answers questions. Piely helps you make and stick to the right decisions.
                </p>
            </div>

            <div ref={cardsRef} className="space-y-6 sm:space-y-8 max-w-5xl">
                {comparisons.map((row, index) => (
                    <div
                        key={index}
                        className="comparison-card flex flex-col md:flex-row gap-4 md:gap-0 border border-border overflow-hidden"
                    >
                        {/* ChatGPT side */}
                        <div className="md:w-[40%] p-6 sm:p-8 bg-background/20 border-b md:border-b-0 md:border-r border-border">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground mb-4">Chatbots</div>
                            <div className="text-base text-muted-foreground/60">{row.chatgpt}</div>
                        </div>

                        {/* Piely side */}
                        <div className="md:flex-1 p-6 sm:p-8 bg-background relative group">
                            <div className="font-mono text-[9px] uppercase tracking-widest text-foreground font-bold mb-4">
                                Piely Decision Platform
                            </div>
                            <div className="text-lg sm:text-xl font-medium text-foreground">{row.piely}</div>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                                <BitmapChevron className="w-6 h-6 rotate-0" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-16 sm:mt-20 max-w-2xl">
                <p className="font-mono text-sm sm:text-base text-foreground font-medium">
                    Piely doesn't replace ChatGPT. It protects you from wasting time with it.
                </p>
            </div>
        </section>
    )
}
