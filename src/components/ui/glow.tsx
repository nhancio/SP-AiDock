import * as React from "react"
import { cn } from "@/lib/utils"

interface GlowProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "above" | "below" | "left" | "right" | "center"
}

const Glow = React.forwardRef<HTMLDivElement, GlowProps>(
  ({ className, variant = "center", ...props }, ref) => {
    const getPositionClasses = () => {
      switch (variant) {
        case "above":
          return "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
        case "below":
          return "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        case "left":
          return "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
        case "right":
          return "right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
        case "center":
        default:
          return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          "absolute w-96 h-96 rounded-full",
          "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20",
          "blur-3xl",
          getPositionClasses(),
          className
        )}
        {...props}
      />
    )
  }
)
Glow.displayName = "Glow"

export { Glow }
