"use client"

import Link from "next/link"

import { Mark } from "@/components/mark"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SiteHeader({
  watching,
  onToggleWatch,
  onArrive,
  onReset,
  busy,
}: {
  watching: boolean
  onToggleWatch: () => void
  onArrive: () => void
  onReset: () => void
  busy?: boolean
}) {
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-border/70 bg-[color-mix(in_oklch,var(--background),var(--card)_55%)] px-4 py-3 sm:px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <Mark />
        <div className="leading-tight">
          <p className="font-heading text-lg tracking-tight">Letterdesk</p>
          <p className="text-[11px] text-muted-foreground">Clerk watches the mail</p>
        </div>
      </Link>
      <nav className="ml-auto flex flex-wrap items-center gap-2">
        <Link
          href="/telegram"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Telegram view
        </Link>
        <button
          type="button"
          onClick={onArrive}
          disabled={busy}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          Pull next letter
        </button>
        <button
          type="button"
          onClick={onToggleWatch}
          className={cn(
            buttonVariants({ variant: watching ? "default" : "secondary", size: "sm" })
          )}
        >
          {watching ? "Watching mailbox" : "Watch mailbox"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          Reset demo
        </button>
      </nav>
    </header>
  )
}
