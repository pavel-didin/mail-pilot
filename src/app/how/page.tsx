import Link from "next/link"

import { Mark } from "@/components/mark"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function HowPage() {
  return (
    <div className="mx-auto min-h-screen max-w-2xl px-4 py-8">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <Mark className="size-7" />
        <span className="font-heading text-lg">Letterdesk</span>
      </Link>
      <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
        Live wiring
      </p>
      <h1 className="mt-2 font-heading text-4xl leading-tight">
        Yes — a website or a Telegram bot can watch mail for you.
      </h1>
      <p className="mt-4 text-[17px] leading-7 text-muted-foreground">
        This demo uses a scripted mailbox so you can feel the habit without
        handing over Gmail. A production version is the same loop with three
        extra pipes.
      </p>

      <ol className="mt-8 grid gap-5 text-[15px] leading-7">
        <li>
          <strong className="text-foreground">1. Watch the mailbox.</strong> Gmail
          API + Google Pub/Sub push (or IMAP IDLE on Fastmail/Zoho) delivers each
          new message without polling every folder yourself.
        </li>
        <li>
          <strong className="text-foreground">2. Let a model read it.</strong> A
          worker classifies urgent / needs you / FYI / noise and writes a two-line
          summary. You never open newsletters unless you ask.
        </li>
        <li>
          <strong className="text-foreground">3. Knock once.</strong> The website
          feed updates, and a Telegram bot sends the summary with an inline
          button. The button is a Gmail search (or thread) URL — one tap into the
          original letter.
        </li>
      </ol>

      <div className="paper-sheet mt-8 p-5 text-sm leading-6">
        <p className="font-heading text-xl text-[color:var(--paper-ink)]">
          What you still cannot skip
        </p>
        <p className="mt-2 text-[color:var(--paper-ink)]/80">
          OAuth consent, a privacy note (mail is sensitive), and a filter you
          trust. Telegram bots cannot deep-link into the Gmail app on every
          phone, but they can open Gmail on the web. Do not auto-send replies
          until you have lived with summaries for a while.
        </p>
      </div>

      <pre className="mt-8 overflow-x-auto rounded-xl bg-secondary p-4 text-xs leading-6">
{`TELEGRAM_BOT_TOKEN=123:abc
TELEGRAM_CHAT_ID=your-chat-id
NEXT_PUBLIC_APP_URL=https://your-host`}
      </pre>
      <p className="mt-3 text-sm text-muted-foreground">
        With those set, Clerk will try a real Telegram send on every knock. This
        demo stays simulated until then.
      </p>

      <Link href="/" className={cn(buttonVariants(), "mt-8")}>
        Back to the desk
      </Link>
    </div>
  )
}
