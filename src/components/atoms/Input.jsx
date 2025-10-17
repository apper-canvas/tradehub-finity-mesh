import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full px-4 py-2.5 bg-white border-2 rounded-md transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "placeholder:text-gray-400",
        error ? "border-error" : "border-gray-300",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;