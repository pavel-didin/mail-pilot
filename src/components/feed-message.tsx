"use client"

import Link from "next/link"
import type { MouseEvent } from "react"

import { PriorityBadge } from "@/components/letter-pane"
import { formatClock, formatRelative } from "@/lib/format"
import type { Letter, TelegramMessage } from "@/lib/types"
import { cn } from "@/lib/utils"

export function TelegramPhone({
  messages,
  letters,
}: {
  messages: TelegramMessage[]
  letters: Letter[]
}) {
  const byId = new Map(letters.map((letter) => [letter.id, letter]))
  const visible = messages.filter((message) => {
    const letter = byId.get(message.letterId)
    return letter?.notified
  })

  return (
    <div className="mx-auto w-full max-w-[380px]">
      <div className="phone-bezel">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <div className="size-9 rounded-full bg-[var(--telegram)]/20 ring-1 ring-[var(--telegram)]/40" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">Letterdesk Clerk</p>
            <p className="text-[11px] text-white/55">
              bot · knocks, does not dump the inbox
            </p>
          </div>
        </div>
        <div className="flex h-[min(620px,70vh)] flex-col gap-3 overflow-y-auto bg-[#0e1621] px-3 py-4">
          {visible.length === 0 ? (
            <p className="px-4 py-16 text-center text-sm text-white/55">
              Clerk is quiet. Nothing passed your filters.
            </p>
          ) : (
            visible.map((message) => {
              const letter = byId.get(message.letterId)
              return (
                <div key={message.id} className="max-w-[92%] self-start">
                  <div className="rounded-2xl rounded-tl-md bg-[#182533] px-3.5 py-2.5 text-[13px] leading-5 text-white/95 shadow-sm">
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <Link
                      href={message.buttonUrl}
                      className="mt-2 block rounded-lg bg-[var(--telegram)]/15 px-3 py-2 text-center text-[13px] font-medium text-[var(--telegram)]"
                    >
                      {message.buttonLabel}
                    </Link>
                    <p className="mt-1 text-right text-[10px] text-white/40">
                      {formatClock(message.sentAt)}
                      {message.delivered === "telegram" ? " · sent" : " · demo"}
                    </p>
                  </div>
                  {letter ? (
                    <p className="mt-1 px-1 text-[10px] text-white/35">
                      {letter.subject} · {formatRelative(letter.receivedAt)}
                    </p>
                  ) : null}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export function FeedMessage({
  letter,
  active,
  onSelect,
}: {
  letter: Letter
  active: boolean
  onSelect: () => void
}) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onSelect()
    if (window.matchMedia("(min-width: 1024px)").matches) {
      event.preventDefault()
    }
  }

  return (
    <Link
      href={`/letter/${letter.id}`}
      onClick={handleClick}
      className={cn(
        "block w-full rounded-2xl px-3.5 py-3 text-left transition-colors",
        active
          ? "bg-secondary ring-1 ring-foreground/10"
          : "hover:bg-secondary/60",
        !letter.read && letter.notified && "bg-secondary/40"
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 size-9 shrink-0 rounded-full font-heading text-sm leading-9 text-center",
            letter.priority === "urgent" && "bg-[var(--urgent-soft)] text-[var(--urgent)]",
            letter.priority === "action" && "bg-[var(--action-soft)] text-[var(--action)]",
            letter.priority === "fyi" && "bg-[var(--fyi-soft)] text-[var(--fyi)]",
            letter.priority === "noise" && "bg-muted text-muted-foreground"
          )}
        >
          {letter.fromName.slice(0, 1)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{letter.fromName}</p>
            <PriorityBadge priority={letter.priority} />
            <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
              {formatRelative(letter.receivedAt)}
            </span>
          </div>
          <p className="mt-1 text-[13px] leading-5 text-foreground/90">
            {letter.summary}
          </p>
          <p className="mt-2 text-[11px] font-medium text-primary lg:hidden">
            Open letter
          </p>
          {!letter.notified ? (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Filed quietly — below your notify bar.
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
