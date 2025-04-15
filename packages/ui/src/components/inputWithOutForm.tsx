import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"
import type { LucideIcon } from "lucide-react"

const InputPure = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & {
  icon?: LucideIcon,
  containerClassName?: string,
  postfix?: string | LucideIcon,
  postfixClassName?: string,
}>(
  ({ className, type, icon: Icon, containerClassName, postfix: Postfix, postfixClassName, ...props }, ref) => {
    return (
      <div className={cn("border rounded-lg flex items-center px-5 py-1 gap-4 h-[2.3rem] w-full",
        props.disabled && 'bg-slate-50',
        props.readOnly && 'border-t-0 border-l-0 border-r-0 rounded-none', containerClassName)} >
        {Icon ? <Icon className="text-gray-500 w-[18px] h-[18px]" /> : null
        }
        <input
          type={type || 'text'}
          className={cn(
            (type === 'number' || type === 'currency') && 'text-right',
            "flex h-6 w-full transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-foreground-500 focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-slate-50 text-sm",
            className,
          )}
          ref={ref}
          {...props}
        />
        {
          Postfix ? <span className="text-gray-500">{typeof Postfix === 'string' ? Postfix : <Postfix className={cn('w-4 h-4', postfixClassName)} />}</span> : null
        }

      </div >
    )
  }
)
InputPure.displayName = "InputPure"

export { InputPure }
