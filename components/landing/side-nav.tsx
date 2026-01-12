"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const navItems = [
    { id: "hero", label: "Piely" },
    { id: "problem", label: "Problem" },
    { id: "solution", label: "Solution" },
    { id: "how-it-works", label: "Process" },
    { id: "comparison", label: "vs ChatGPT" },
    { id: "who", label: "Who" },
    { id: "why", label: "Why" },
    { id: "pricing", label: "Pricing" },
]

export function SideNav() {
    const [activeSection, setActiveSection] = useState("hero")

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id)
                    }
                })
            },
            { threshold: 0.3 },
        )

        navItems.forEach(({ id }) => {
            const element = document.getElementById(id)
            if (element) observer.observe(element)
        })

        return () => observer.disconnect()
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <nav className="fixed left-0 top-0 z-50 h-screen w-16 md:w-20 hidden md:flex flex-col justify-center border-r border-border/20 bg-background/40 backdrop-blur-md">
            <div className="flex flex-col gap-8 px-4">
                {navItems.map(({ id, label }) => (
                    <button
                        key={id}
                        onClick={() => scrollToSection(id)}
                        className="group relative flex items-center justify-center py-2"
                    >
                        <span
                            className={cn(
                                "h-1 w-4 transition-all duration-300",
                                activeSection === id
                                    ? "bg-gradient-to-r from-[#FF6B35] to-[#87CEEB] w-8"
                                    : "bg-muted-foreground/20 group-hover:bg-muted-foreground/50",
                            )}
                        />
                        <span
                            className={cn(
                                "absolute left-10 font-mono text-[9px] uppercase tracking-[0.2em] opacity-0 transition-all duration-300 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap",
                                activeSection === id ? "text-foreground" : "text-muted-foreground",
                            )}
                        >
                            {label}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    )
}
