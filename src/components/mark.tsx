import { cn } from "@/lib/utils"

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path
        d="M7.5 11.5 16 17l8.5-5.5"
        stroke="var(--primary-foreground)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="7"
        y="10"
        width="18"
        height="13"
        rx="2"
        stroke="var(--primary-foreground)"
        strokeWidth="1.8"
      />
      <circle cx="22.5" cy="21.5" r="4.2" fill="var(--wax)" />
      <circle
        cx="22.5"
        cy="21.5"
        r="2.4"
        stroke="var(--primary-foreground)"
        strokeWidth="1"
        opacity="0.7"
      />
    </svg>
  )
}
