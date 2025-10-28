"use client";

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  titleClassName = "text-blue-500",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-40 w-[24rem] -skew-y-[8deg] select-none flex-col justify-between rounded-2xl border-2 bg-gradient-to-br from-white to-gray-50 px-6 py-4 transition-all duration-700 hover:border-blue-300/50 hover:bg-white hover:shadow-2xl [&>*]:flex [&>*]:items-center [&>*]:gap-2 group",
        className
      )}
    >
      <div>
        <span className="relative inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-2 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </span>
        <p className={cn("text-xl font-bold", titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg text-gray-700 font-medium">{description}</p>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{date}</p>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      title: "ChatGPT",
      description: "Advanced AI conversation",
      date: "Most Popular",
      icon: <Sparkles className="size-4 text-blue-300" />,
      titleClassName: "text-blue-500",
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      title: "Midjourney",
      description: "AI image generation",
      date: "Trending",
      icon: <Sparkles className="size-4 text-purple-300" />,
      titleClassName: "text-purple-500",
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      title: "Claude",
      description: "AI assistant by Anthropic",
      date: "New",
      icon: <Sparkles className="size-4 text-green-300" />,
      titleClassName: "text-green-500",
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
