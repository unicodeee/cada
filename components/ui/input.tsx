import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    size?: "default" | "lg" | "xl";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, size = "default", ...props }, ref) => {
        // Define size variants
        const sizeClasses = {
            default: "h-9 px-3 py-1 text-base md:text-sm",
            lg: "h-12 px-4 py-2 text-lg",
            xl: "h-14 px-5 py-3 text-xl"
        };

        return (
            <input
                type={type}
                className={cn(
                    "flex w-full rounded-md border border-input bg-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    sizeClasses[size],
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