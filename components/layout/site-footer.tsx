"use client"

import Link from "next/link"
import { Logo } from "@/components/ui/logo"
import { usePathname } from "next/navigation"

export function SiteFooter() {
    const pathname = usePathname()

    // Hide footer on dashboard routes
    if (pathname?.startsWith("/dashboard")) {
        return null
    }

    return (
        <footer className="border-t border-border/40 bg-background py-12 md:py-16">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="font-bold text-xl tracking-tighter flex items-center gap-2">
                            <Logo className="w-8 h-8" />
                            <span>PIELY</span>
                        </Link>
                        <p className="mt-4 text-muted-foreground text-sm max-w-xs leading-relaxed">
                            Decision intelligence for founders. meaningful logic, not generic advice.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold mb-4">Product</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                            </li>
                            <li>
                                <Link href="/auth/login" className="hover:text-foreground transition-colors">Login</Link>
                            </li>
                            <li>
                                <Link href="/auth/signup" className="hover:text-foreground transition-colors">Sign Up</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-mono text-xs uppercase tracking-widest text-foreground font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li>
                                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-foreground transition-colors">Terms & Conditions</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 md:mt-16 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <div className="font-mono">
                        © {new Date().getFullYear()} Piely Inc. All rights reserved.
                    </div>
                    <div className="flex gap-6">
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                            Twitter
                        </a>
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
