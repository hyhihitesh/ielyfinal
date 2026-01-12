"use client"

import { useRef, useEffect } from "react"
import { HighlightText } from "@/components/landing/highlight-text"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function SolutionSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const benefitsRef = useRef<HTMLUListElement>(null)

    const benefits = [
        "see your startup clearly",
        "understand the real risks you're taking",
        "choose the safest next move",
        "avoid wasting time on paths that usually fail",
    ]

    useEffect(() => {
        if (!sectionRef.current || !headerRef.current || !benefitsRef.current) return

        const header = headerRef.current
        const benefitsContainer = benefitsRef.current

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

            const items = benefitsContainer.querySelectorAll("li")
            if (items.length > 0) {
                gsap.from(items, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: benefitsContainer,
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
            id="solution"
            className="relative py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:pl-32 md:pr-16 bg-saffron/5"
        >
            <div ref={headerRef} className="mb-16 sm:mb-20 md:mb-24">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">02 / Solution</span>
                <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight max-w-3xl text-balance text-foreground">
                    What if you had a system that helped you{" "}
                    <HighlightText>
                        <span className="italic">decide</span>
                    </HighlightText>{" "}
                    — not guess?
                </h2>
            </div>

            <div className="max-w-2xl">
                <p className="font-mono text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">Piely helps you:</p>
                <ul ref={benefitsRef} className="space-y-4 sm:space-y-5">
                    {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 sm:gap-4 text-base sm:text-lg text-foreground">
                            <span className="text-muted-foreground font-mono text-xs sm:text-sm mt-1">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span className="font-medium">{benefit}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-16 sm:mt-20 pt-8 sm:pt-12 border-t border-border/30">
                    <p className="font-mono text-xs sm:text-sm text-foreground">All in one calm, structured workspace.</p>
                </div>
            </div>
        </section>
    )
}
