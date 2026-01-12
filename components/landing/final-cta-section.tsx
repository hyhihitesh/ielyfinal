"use client"

import { useRef, useEffect } from "react"
import { ScrambleTextOnHover } from "@/components/landing/scramble-text"
import { BitmapChevron } from "@/components/landing/bitmap-chevron"
import { AnimatedNoise } from "@/components/landing/animated-noise"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function FinalCtaSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!sectionRef.current || !contentRef.current) return

        const ctx = gsap.context(() => {
            gsap.from(contentRef.current, {
                y: 50,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section
            ref={sectionRef}
            id="why"
            className="relative py-28 sm:py-36 md:py-52 px-4 sm:px-6 md:pl-32 md:pr-16 bg-foreground text-background overflow-hidden"
        >
            <AnimatedNoise opacity={0.08} />

            <div ref={contentRef} className="relative z-10 max-w-4xl">
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-br from-[#FF6B35] to-[#87CEEB] text-balance">
                    Stop guessing.
                    <br />
                    Start deciding.
                </h2>
                <p className="text-lg sm:text-xl md:text-2xl text-background/70 mb-10 sm:mb-12 max-w-2xl font-light leading-relaxed">
                    Use Piely to make clearer decisions — before the stakes get higher.
                </p>

                <a
                    href="/onboarding"
                    className="group inline-flex items-center gap-3 border-2 border-background px-6 sm:px-8 py-3 sm:py-4 font-mono text-[10px] sm:text-xs uppercase tracking-widest text-background hover:bg-background hover:text-foreground transition-all duration-300 w-full sm:w-auto justify-center"
                >
                    <ScrambleTextOnHover text="Start Free" as="span" duration={0.5} />
                    <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
                </a>

                <div className="mt-16 sm:mt-20 md:mt-24 pt-8 sm:pt-12 border-t border-background/20">
                    <p className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-background/60">
                        Piely — Decision intelligence for founders.
                    </p>
                </div>
            </div>
        </section>
    )
}
