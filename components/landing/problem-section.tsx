"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ProblemSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const problems = [
        "stay too long on the wrong path",
        "confuse effort with progress",
        "don't know when to stop, pivot, or continue",
        "keep asking for advice instead of making decisions",
    ]

    useEffect(() => {
        if (!sectionRef.current || !headerRef.current || !listRef.current) return

        const header = headerRef.current
        const listContainer = listRef.current

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

            const items = listContainer.querySelectorAll("div")
            if (items.length > 0) {
                gsap.from(items, {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: listContainer,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="problem" className="relative py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:pl-32 md:pr-16">
            <div ref={headerRef} className="mb-16 sm:mb-20 md:mb-24">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">01 / Problem</span>
                <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight max-w-3xl text-balance text-brand">
                    Most founders don't fail because they lack ideas.
                </h2>
            </div>

            <div className="max-w-3xl">
                <p className="font-mono text-xs sm:text-sm text-muted-foreground mb-8 uppercase tracking-widest">
                    They fail because they:
                </p>
                <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {problems.map((problem, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 border-l-2 border-border/50 pl-6 py-2 group hover:border-saffron transition-all duration-500"
                        >
                            <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground">0{index + 1}</span>
                            <span className="font-mono text-sm sm:text-base text-foreground leading-snug group-hover:translate-x-1 transition-transform duration-300">
                                {problem}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-20 sm:mt-28 pt-12 border-t border-border/50">
                    <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        <span className="text-foreground font-medium">Chatbots give answers. Spreadsheets give numbers.</span>
                        <br />
                        <br />
                        None of them help you decide.
                    </p>
                </div>
            </div>
        </section>
    )
}
