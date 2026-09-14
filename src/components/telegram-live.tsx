"use client"

import { useEffect, useState } from "react"

import { TelegramPhone } from "@/components/feed-message"
import type { InboxSnapshot } from "@/lib/types"

export function TelegramLive({ initial }: { initial: InboxSnapshot }) {
  const [data, setData] = useState<InboxSnapshot>(initial)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const id = window.setInterval(async () => {
      try {
        const response = await fetch("/api/inbox", { cache: "no-store" })
        if (!response.ok) throw new Error("Mailbox unreachable")
        const snapshot = (await response.json()) as InboxSnapshot
        if (!cancelled) {
          setData(snapshot)
          setError(null)
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Mailbox unreachable")
        }
      }
    }, 4000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [])

  if (error) {
    return (
      <p className="mx-auto max-w-sm rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-center text-sm">
        {error}
      </p>
    )
  }

  return <TelegramPhone messages={data.telegram} letters={data.letters} />
}
