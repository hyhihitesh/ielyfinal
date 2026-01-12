import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-input/50 bg-background/50 backdrop-blur-sm px-4 py-2 text-base transition-all duration-200 outline-none",
        "placeholder:text-muted-foreground placeholder:opacity-70",
        "focus:border-sky/50 focus:ring-2 focus:ring-sky/20 focus:bg-background",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:text-foreground file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }

