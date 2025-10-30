import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors"

  const variants = {
    default: "bg-slate-100 text-slate-900",
    outline: "border border-slate-300 bg-white text-slate-900",
  }

  return <div className={`${baseStyles} ${variants[variant]} ${className || ""}`} ref={ref} {...props} />
})
Badge.displayName = "Badge"

export { Badge }
