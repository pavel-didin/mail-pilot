import Link from "next/link"
import { ExternalLinkIcon, MailOpenIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatRelative, priorityHint, priorityLabel } from "@/lib/format"
import type { Letter } from "@/lib/types"
import { cn } from "@/lib/utils"

export function LetterPane({
  letter,
  compact,
  hideOpenLink,
}: {
  letter: Letter | null
  compact?: boolean
  hideOpenLink?: boolean
}) {
  if (!letter) {
    return (
      <div className="flex h-full min-h-72 flex-col items-center justify-center gap-2 px-8 text-center">
        <MailOpenIcon className="size-8 text-muted-foreground/70" />
        <p className="font-heading text-xl">No letter selected</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Pick a knock from the feed. Clerk already read it so you do not have to
          open the whole inbox.
        </p>
      </div>
    )
  }

  return (
    <article className={cn("flex h-full flex-col", compact && "min-h-0")}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={letter.priority} />
            <span className="text-xs text-muted-foreground">
              {formatRelative(letter.receivedAt)} · {letter.account}
            </span>
          </div>
          <h2 className="font-heading text-2xl leading-tight tracking-tight">
            {letter.subject}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {letter.fromName}{" "}
            <span className="font-mono text-xs">&lt;{letter.fromEmail}&gt;</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {hideOpenLink ? null : (
            <Link
              href={`/letter/${letter.id}`}
              className={cn(buttonVariants({ size: "sm" }))}
            >
              Open letter
            </Link>
          )}
          <a
            href={letter.gmailUrl}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: hideOpenLink ? "default" : "outline",
                size: "sm",
              })
            )}
          >
            Open in Gmail
            <ExternalLinkIcon data-icon="inline-end" />
          </a>
        </div>
      </div>

      <div className="grid gap-3 px-5 py-4">
        <section className="rounded-xl bg-secondary/70 p-4 ring-1 ring-foreground/8">
          <p className="text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
            Clerk
          </p>
          <p className="mt-1 text-[15px] leading-relaxed">{letter.summary}</p>
          <p className="mt-2 text-sm text-muted-foreground">{letter.why}</p>
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">Do this: </span>
            {letter.suggestedAction}
          </p>
        </section>
      </div>

      <Separator />

      <div className="paper-sheet m-5 flex-1 overflow-auto p-5 sm:p-6">
        <p className="mb-4 font-mono text-[11px] tracking-wide text-[color:var(--wax)] uppercase">
          Original letter
        </p>
        <p className="font-heading text-xl leading-snug">{letter.subject}</p>
        <p className="mt-2 text-sm opacity-70">
          From {letter.fromName}
          <br />
          To {letter.account}
        </p>
        <p className="mt-5 whitespace-pre-wrap text-[15px] leading-7">
          {letter.body}
        </p>
      </div>
    </article>
  )
}

export function PriorityBadge({ priority }: { priority: Letter["priority"] }) {
  return (
    <Badge
      variant="outline"
      title={priorityHint[priority]}
      className={cn(
        "border-transparent capitalize",
        priority === "urgent" && "bg-[var(--urgent-soft)] text-[var(--urgent)]",
        priority === "action" && "bg-[var(--action-soft)] text-[var(--action)]",
        priority === "fyi" && "bg-[var(--fyi-soft)] text-[var(--fyi)]",
        priority === "noise" && "bg-muted text-muted-foreground"
      )}
    >
      {priorityLabel[priority]}
    </Badge>
  )
}
