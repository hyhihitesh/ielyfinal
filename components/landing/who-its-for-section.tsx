"use client"

import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function WhoItsForSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const columnsRef = useRef<HTMLDivElement>(null)

    const forList = [
        "solo founders",
        "early-stage startup builders",
        "people risking real time or money",
        "founders who want clarity, not hype",
    ]
    const notForList = ["idea collectors", "motivation seekers", "people looking for shortcuts"]

    useEffect(() => {
        if (!sectionRef.current || !headerRef.current || !columnsRef.current) return

        const header = headerRef.current
        const columnsContainer = columnsRef.current

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

            const columns = columnsContainer.querySelectorAll(".column")
            if (columns.length > 0) {
                gsap.from(columns, {
                    y: 40,
                    opacity: 0,
                    duration: 0.9,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: columnsContainer,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                })
            }
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    return (
        <section ref={sectionRef} id="who" className="relative py-20 sm:py-28 md:py-40 px-4 sm:px-6 md:pl-32 md:pr-16">
            <div ref={headerRef} className="mb-16 sm:mb-20 md:mb-24">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">05 / Audience</span>
                <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
                    Who Piely Is For
                </h2>
            </div>

            <div ref={columnsRef} className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 md:gap-24 max-w-5xl">
                <div className="column group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-8 h-px bg-foreground" />
                        <h3 className="font-mono text-xs uppercase tracking-widest text-foreground">Built For</h3>
                    </div>
                    <ul className="space-y-6 sm:space-y-8">
                        {forList.map((item, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="mt-2 w-2 h-2 bg-[#FF6B35] rounded-full group-hover:scale-125 transition-transform" />
                                <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="column group opacity-60 hover:opacity-100 transition-opacity duration-500">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-8 h-px bg-muted-foreground/40" />
                        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Not For</h3>
                    </div>
                    <ul className="space-y-6 sm:space-y-8">
                        {notForList.map((item, index) => (
                            <li key={index} className="flex items-start gap-4 italic grayscale">
                                <div className="mt-2 w-2 h-2 border border-muted-foreground rounded-full" />
                                <span className="text-xl sm:text-2xl font-bold tracking-tight text-muted-foreground">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
