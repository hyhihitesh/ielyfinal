"use client"

import { useState, useEffect } from "react"

type Breakpoint = "mobile" | "tablet" | "desktop"

const BREAKPOINTS = {
    mobile: 0,
    tablet: 768,
    desktop: 1200,
} as const

export function useBreakpoint(): Breakpoint {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop")

    useEffect(() => {
        const getBreakpoint = (): Breakpoint => {
            const width = window.innerWidth
            if (width < BREAKPOINTS.tablet) return "mobile"
            if (width < BREAKPOINTS.desktop) return "tablet"
            return "desktop"
        }

        const handleResize = () => {
            setBreakpoint(getBreakpoint())
        }

        // Set initial value
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return breakpoint
}

export function useIsMobile(): boolean {
    const breakpoint = useBreakpoint()
    return breakpoint === "mobile"
}

export function useIsTablet(): boolean {
    const breakpoint = useBreakpoint()
    return breakpoint === "tablet"
}

export function useIsDesktop(): boolean {
    const breakpoint = useBreakpoint()
    return breakpoint === "desktop"
}
