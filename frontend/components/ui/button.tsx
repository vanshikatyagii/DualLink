import * as React from "react"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "default", ...props }, ref) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const variants = {
    default: "",
    outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
  }

  return <button className={`${baseStyles} ${variants[variant]} ${className || ""}`} ref={ref} {...props} />
})
Button.displayName = "Button"

export { Button }
