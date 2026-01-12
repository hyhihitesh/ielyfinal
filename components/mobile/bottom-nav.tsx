"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LayoutDashboard, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    {
        label: "Home",
        href: "/",
        icon: Home,
    },
    {
        label: "Project",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Profile",
        href: "/profile",
        icon: User,
    },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-white/20 md:hidden pb-safe">
            <div className="flex items-center justify-around h-16 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== "/" && pathname?.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "relative flex flex-col items-center justify-center gap-1.5 px-5 py-2.5 rounded-full transition-all duration-300",
                                isActive
                                    ? "text-saffron bg-saffron/10"
                                    : "text-muted-foreground/80 hover:text-foreground hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-saffron/20 blur-xl rounded-full" />
                            )}
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-transform duration-300 relative z-10",
                                    isActive && "scale-110 drop-shadow-[0_0_8px_rgba(255,107,53,0.5)]"
                                )}
                                fill={isActive ? "currentColor" : "none"}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className={cn(
                                "text-[9px] font-bold uppercase tracking-widest relative z-10",
                                isActive ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </div>
            {/* Safe area padding for notched devices */}
            <div className="h-safe-area-inset-bottom bg-background" />
        </nav>
    )
}
