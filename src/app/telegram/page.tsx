import Link from "next/link"

import { TelegramLive } from "@/components/telegram-live"
import { Mark } from "@/components/mark"
import { buttonVariants } from "@/components/ui/button"
import { getStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function TelegramPage() {
  const initial = getStore().snapshot()
  return (
    <div className="min-h-screen px-4 py-6">
      <header className="mx-auto mb-6 flex max-w-lg items-center gap-3">
        <Link href="/" className="flex items-center gap-2">
          <Mark className="size-7" />
          <span className="font-heading text-lg">Letterdesk</span>
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "ml-auto")}
        >
          Website desk
        </Link>
      </header>
      <div className="mx-auto max-w-lg text-center">
        <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Telegram surface
        </p>
        <h1 className="mt-2 font-heading text-3xl">Check the bot, not the inbox</h1>
        <p className="mt-2 mb-6 text-sm leading-6 text-muted-foreground">
          Same knocks Clerk would send to Telegram: a summary and one button that
          opens the letter. Add a bot token later to push to your real chat.
        </p>
      </div>
      <TelegramLive initial={initial} />
    </div>
  )
}
