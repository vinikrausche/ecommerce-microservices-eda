import { cn } from "@/lib/utils"

type SkeletonProps = {
  className?: string
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#2a2a2a]/70",
        className
      )}
    />
  )
}
