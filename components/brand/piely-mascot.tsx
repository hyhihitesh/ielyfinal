"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

type Variant = "happy" | "thinking" | "sleeping";

interface PielyMascotProps extends Omit<HTMLMotionProps<"div">, "children"> {
    variant?: Variant;
    size?: "sm" | "md" | "lg" | "xl" | number;
    className?: string;
    priority?: boolean;
}

const VARIANTS: Record<Variant, { src: string; alt: string }> = {
    happy: {
        src: "/assets/character/happy.png",
        alt: "Piely waving happily",
    },
    thinking: {
        src: "/assets/character/thinking.png",
        alt: "Piely analyzing data",
    },
    sleeping: {
        src: "/assets/character/sleeping.png",
        alt: "Piely sleeping peacefully",
    },
};

const SIZES = {
    sm: 32,
    md: 48,
    lg: 96,
    xl: 160,
};

export function PielyMascot({
    variant = "happy",
    size = "md",
    className,
    priority = false,
    ...props
}: PielyMascotProps) {
    const { src, alt } = VARIANTS[variant];
    const width = typeof size === "number" ? size : SIZES[size];

    return (
        <motion.div
            className={cn("relative shrink-0 select-none", className)}
            style={{ width, height: width }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            <Image
                src={src}
                alt={alt}
                fill
                className="object-contain drop-shadow-sm"
                priority={priority}
                draggable={false}
            />
        </motion.div>
    );
}
