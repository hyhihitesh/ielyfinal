"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

const navItems = [
    { id: "problem", label: "Problem" },
    { id: "solution", label: "Solution" },
    { id: "how-it-works", label: "How It Works" },
    { id: "pricing", label: "Pricing" },
]

export function MobileHeader() {
    const [isOpen, setIsOpen] = useState(false)

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            setIsOpen(false)
        }
    }

    return (
        <>
            {/* Fixed Header */}
            <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <Logo className="w-8 h-8" />
                        <span className="font-mono text-sm uppercase tracking-widest text-foreground font-bold">Piely</span>
                    </Link>

                    {/* Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 border border-border/50 hover:bg-secondary transition-colors"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                    >
                        {isOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/90 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu Panel */}
                        <motion.nav
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3, ease: "circOut" }}
                            className="fixed top-14 right-0 bottom-0 w-3/4 max-w-xs bg-background border-l-2 border-border z-50 md:hidden shadow-2xl"
                        >
                            <div className="flex flex-col h-full p-6">
                                {/* Nav Links */}
                                <div className="flex-1 space-y-2">
                                    {navItems.map(({ id, label }, index) => (
                                        <motion.button
                                            key={id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => scrollToSection(id)}
                                            className="w-full text-left px-4 py-4 border-b border-border/30 text-foreground hover:bg-muted/50 transition-colors font-mono text-[10px] uppercase tracking-widest flex items-center justify-between group"
                                        >
                                            {label}
                                            <div className="w-1 h-1 bg-saffron opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </motion.button>
                                    ))}
                                </div>

                                {/* CTA Buttons */}
                                <div className="space-y-3 pt-6 border-t border-border/30">
                                    <Link href="/auth/login" className="block">
                                        <Button variant="outline" className="w-full">
                                            Log In
                                        </Button>
                                    </Link>
                                    <Link href="/auth/signup" className="block">
                                        <Button variant="glow" className="w-full">
                                            Get Started Free
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.nav>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
