// src/components/RefreshButton.tsx
import React from "react";
import { cn } from "@/lib/utils";

const RefreshButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 border rounded-lg hover:bg-gray-50",
        "dark:hover:bg-gray-600 dark:text-white flex items-center",
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Refresh
    </button>
  );
});

RefreshButton.displayName = "RefreshButton";

export { RefreshButton };