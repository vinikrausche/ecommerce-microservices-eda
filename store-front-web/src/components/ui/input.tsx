import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[#2a2a2a] bg-[#101010] px-3 py-2 text-sm text-[#F5F5F5] shadow-sm transition",
          "placeholder:text-[#D8CFC4]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3E26]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
