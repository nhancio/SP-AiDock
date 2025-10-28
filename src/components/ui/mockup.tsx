import * as React from "react"
import { cn } from "@/lib/utils"

interface MockupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const Mockup = React.forwardRef<HTMLDivElement, MockupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative mx-auto max-w-4xl",
          "rounded-2xl border border-border/50",
          "bg-background/50 backdrop-blur-sm",
          "shadow-2xl",
          "overflow-hidden",
          className
        )}
        {...props}
      >
        
        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    )
  }
)
Mockup.displayName = "Mockup"

export { Mockup }
