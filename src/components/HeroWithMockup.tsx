import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Mockup } from "@/components/ui/mockup"
import { Glow } from "@/components/ui/glow"
import { Github } from "lucide-react"

interface HeroWithMockupProps {
  title: string
  description: string
  primaryCta?: {
    text: string
    href: string
  }
  secondaryCta?: {
    text: string
    href: string
    icon?: React.ReactNode
  }
  mockupImage: {
    src: string
    alt: string
    width: number
    height: number
  }
  className?: string
}

export function HeroWithMockup({
  title,
  description,
  primaryCta = {
    text: "Get Started",
    href: "/get-started",
  },
  secondaryCta = {
    text: "GitHub",
    href: "https://github.com/your-repo",
    icon: <Github className="mr-2 h-4 w-4" />,
  },
  mockupImage,
  className,
}: HeroWithMockupProps) {
  return (
    <section
      className={cn(
        "relative bg-background text-foreground",
        "py-12 px-4 md:py-24 lg:py-32",
        "overflow-hidden",
        className,
      )}
    >
      <div className="relative mx-auto max-w-[1280px] flex flex-col gap-12 lg:gap-24">
        <div className="relative z-10 flex flex-col items-center gap-6 pt-8 md:pt-16 text-center lg:gap-12">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 mb-4 animate-appear opacity-0 [animation-delay:100ms]">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-700">Discover the Future of AI</span>
          </div>

          {/* Heading */}
          <h1
            className={cn(
              "inline-block animate-appear opacity-0 [animation-delay:200ms]",
              "bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900",
              "bg-clip-text text-transparent",
              "text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl",
              "leading-[1.1] sm:leading-[1.1]",
              "drop-shadow-sm",
            )}
          >
            {title}
          </h1>

          {/* Description */}
          <p
            className={cn(
              "max-w-[600px] animate-appear opacity-0 [animation-delay:300ms]",
              "text-lg sm:text-xl md:text-2xl",
              "text-gray-600",
              "font-medium leading-relaxed",
            )}
          >
            {description}
          </p>

          {/* CTAs */}
          <div
            className="relative z-10 flex flex-wrap justify-center gap-6 
            animate-appear opacity-0 [animation-delay:400ms]"
          >
            <Button
              asChild
              size="lg"
              className={cn(
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                "text-white shadow-xl hover:shadow-2xl",
                "px-8 py-4 text-lg font-semibold",
                "transition-all duration-300 transform hover:scale-105",
                "border-0",
              )}
            >
              <a href={primaryCta.href}>{primaryCta.text}</a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className={cn(
                "border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800",
                "px-8 py-4 text-lg font-semibold",
                "bg-white hover:bg-gray-50",
                "transition-all duration-300 transform hover:scale-105",
              )}
            >
              <a href={secondaryCta.href}>
                {secondaryCta.icon}
                {secondaryCta.text}
              </a>
            </Button>
          </div>

          {/* Mockup */}
          <div className="relative w-full pt-16 px-4 sm:px-6 lg:px-8">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
              
              <Mockup
                className={cn(
                  "animate-appear opacity-0 [animation-delay:500ms]",
                  "shadow-2xl hover:shadow-3xl",
                  "border-0 bg-white/80 backdrop-blur-sm",
                  "transform hover:scale-[1.02] transition-all duration-500",
                )}
              >
                <img
                  {...mockupImage}
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                  decoding="async"
                />
              </Mockup>
            </div>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Glow
          variant="center"
          className="animate-appear-zoom opacity-0 [animation-delay:600ms]"
        />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </section>
  )
}
