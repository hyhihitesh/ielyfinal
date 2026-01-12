"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HowItWorksSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const stepsRef = useRef<HTMLDivElement>(null)

    const steps = [
        {
            number: "01",
            title: "Understand your reality",
            description: "Piely learns your constraints — capital, time pressure, risk tolerance, and skills.",
        },
        {
            number: "02",
            title: "Build a visual strategy map",
            description: "Your startup appears as a clear, living decision map — not a long document.",
        },
        {
            number: "03",
            title: "Apply real patterns",
            description: "Piely overlays real startup success and failure patterns to highlight risks early.",
        },
        {
            number: "04",
            title: "Execute with discipline",
            description: "Every action is time-boxed with clear stop conditions — so you don't grind blindly.",
        },
        {
            number: "05",
            title: "Learn and adjust",
            description: "After execution, Piely helps you decide whether to persist, pivot, or switch paths.",
        },
    ]

    useEffect(() => {
        if (!sectionRef.current || !headerRef.current || !stepsRef.current) return

        const header = headerRef.current
        const stepsContainer = stepsRef.current

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

            const stepElements = stepsContainer.querySelectorAll("article")
            if (stepElements.length > 0) {
                gsap.from(stepElements, {
                    y: 50,
                    opacity: 0,
                    duration: 0.9,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: stepsContainer,
                        start: "top 75%",
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
            id="how-it-works"
            className="relative py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:pl-32 md:pr-16"
        >
            <div ref={headerRef} className="mb-16 sm:mb-20 md:mb-24">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">03 / Process</span>
                <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
                    A Strategy for Discipline
                </h2>
            </div>

            <div ref={stepsRef} className="space-y-16 md:space-y-24">
                {steps.map((step, index) => (
                    <article key={index} className="flex flex-col md:flex-row gap-6 md:gap-12 max-w-5xl relative group">
                        <div className="md:w-32">
                            <span className="font-mono text-xs sm:text-sm font-bold text-foreground group-hover:text-brand transition-all duration-300">
                                STEP {step.number}
                            </span>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">{step.title}</h3>
                            <p className="font-mono text-sm text-muted-foreground leading-relaxed max-w-2xl">{step.description}</p>
                        </div>
                        <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-border/30 group-hover:bg-gradient-to-b group-hover:from-saffron group-hover:to-sky transition-colors hidden md:block" />
                    </article>
                ))}
            </div>
        </section>
    )
}
