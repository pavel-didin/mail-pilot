"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { InboxIcon, Loader2Icon, RadioIcon } from "lucide-react"

import { FeedMessage } from "@/components/feed-message"
import { LetterPane } from "@/components/letter-pane"
import { SiteHeader } from "@/components/site-header"
import { TelegramPhone } from "@/components/feed-message"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { InboxSnapshot, Letter, Prefs } from "@/lib/types"
import { cn } from "@/lib/utils"

type Filter = "knock" | "all" | "quiet"

async function fetchInbox() {
  const response = await fetch("/api/inbox", { cache: "no-store" })
  if (!response.ok) throw new Error("Mailbox unreachable")
  return (await response.json()) as InboxSnapshot
}

export function InboxDesk({ initial }: { initial: InboxSnapshot }) {
  const [data, setData] = useState<InboxSnapshot>(initial)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [watching, setWatching] = useState(false)
  const [filter, setFilter] = useState<Filter>("knock")
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(
    initial.letters[0]?.id ?? null
  )
  const [sheetOpen, setSheetOpen] = useState(false)
  const [arriving, setArriving] = useState(false)
  const [channel, setChannel] = useState("desk")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const snapshot = await fetchInbox()
      setData(snapshot)
      setError(null)
      setSelectedId((current) => current ?? snapshot.letters[0]?.id ?? null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Mailbox unreachable")
    } finally {
      setLoading(false)
    }
  }, [])

  const arrive = useCallback(async (fromWatch = false) => {
    setArriving(true)
    try {
      const response = await fetch("/api/inbox/arrive", { method: "POST" })
      if (!response.ok) throw new Error("Could not pull mail")
      const payload = (await response.json()) as {
        letter: Letter | null
        exhausted: boolean
        snapshot: InboxSnapshot
      }
      setData(payload.snapshot)
      if (!payload.letter) {
        if (!fromWatch) toast.message("Mailbox is empty", { description: "Reset the demo to refill the queue." })
        setWatching(false)
        return
      }
      if (payload.letter.notified) {
        toast.message(`${payload.letter.fromName} · new letter`, {
          description: payload.letter.summary,
          action: {
            label: "Open",
            onClick: () => {
              setSelectedId(payload.letter!.id)
              setSheetOpen(true)
            },
          },
        })
        setSelectedId(payload.letter.id)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not pull mail")
    } finally {
      setArriving(false)
    }
  }, [])

  useEffect(() => {
    if (!watching) return
    const id = window.setInterval(() => {
      void arrive(true)
    }, 7000)
    return () => window.clearInterval(id)
  }, [watching, arrive])

  const selected = data.letters.find((letter) => letter.id === selectedId) ?? null

  const counts = useMemo(() => {
    const letters = data.letters
    return {
      knock: letters.filter((letter) => letter.notified).length,
      all: letters.length,
      quiet: letters.filter((letter) => !letter.notified).length,
    }
  }, [data])

  const visible = useMemo(() => {
    const letters = data.letters
    const needle = query.trim().toLowerCase()
    return letters.filter((letter) => {
      if (filter === "knock" && !letter.notified) return false
      if (filter === "quiet" && letter.notified) return false
      if (!needle) return true
      return `${letter.fromName} ${letter.subject} ${letter.summary}`
        .toLowerCase()
        .includes(needle)
    })
  }, [data, filter, query])

  async function patchPrefs(patch: Partial<Prefs>) {
    const response = await fetch("/api/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    if (!response.ok) return
    setData((await response.json()) as InboxSnapshot)
  }

  async function markRead(id: string) {
    const response = await fetch(`/api/inbox/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    })
    if (!response.ok) return
    const payload = (await response.json()) as { snapshot: InboxSnapshot }
    setData(payload.snapshot)
  }

  function selectLetter(id: string, mobileSheet = false) {
    setSelectedId(id)
    void markRead(id)
    if (mobileSheet) setSheetOpen(true)
  }

  async function resetDemo() {
    const response = await fetch("/api/inbox", { method: "DELETE" })
    if (!response.ok) return
    const snapshot = (await response.json()) as InboxSnapshot
    setData(snapshot)
    setSelectedId(snapshot.letters[0]?.id ?? null)
    setWatching(false)
    toast.success("Demo mailbox reset")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        watching={watching}
        busy={arriving}
        onToggleWatch={() => setWatching((value) => !value)}
        onArrive={() => void arrive(false)}
        onReset={() => void resetDemo()}
      />

      {error ? (
        <div className="mx-4 mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm">
          <p className="font-medium">Clerk lost the mailbox.</p>
          <p className="text-muted-foreground">{error}</p>
          <Button size="sm" className="mt-2" onClick={() => void load()}>
            Retry
          </Button>
        </div>
      ) : null}

      <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_minmax(320px,420px)]">
        <aside className="border-b border-border/70 p-4 lg:border-r lg:border-b-0">
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Why this exists
          </p>
          <p className="mt-2 font-heading text-2xl leading-tight">
            Check a knock, not an inbox.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Clerk reads new mail, throws away noise, and pings this desk — or
            Telegram — with a summary and one button to the letter.
          </p>

          <div className="mt-5 grid gap-2">
            {(
              [
                ["knock", `Knocks · ${counts.knock}`],
                ["all", `Everything · ${counts.all}`],
                ["quiet", `Filed quiet · ${counts.quiet}`],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={cn(
                  "rounded-lg px-3 py-2 text-left text-sm",
                  filter === value ? "bg-secondary" : "hover:bg-secondary/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <Separator className="my-4" />

          <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            What Clerk may knock about
          </p>
          <div className="grid gap-3 text-sm">
            <PrefRow
              label="Urgent"
              hint="Travel, money, security, today"
              checked={data.prefs.notifyUrgent}
              onChange={(checked) => void patchPrefs({ notifyUrgent: checked })}
            />
            <PrefRow
              label="Needs you"
              hint="Reviews, meetings, asks"
              checked={data.prefs.notifyAction}
              onChange={(checked) => void patchPrefs({ notifyAction: checked })}
            />
            <PrefRow
              label="FYI"
              hint="Receipts, lab notes"
              checked={data.prefs.notifyFyi}
              onChange={(checked) => void patchPrefs({ notifyFyi: checked })}
            />
            <PrefRow
              label="Quiet / noise"
              hint="Digests, LinkedIn, bots"
              checked={data.prefs.notifyNoise}
              onChange={(checked) => void patchPrefs({ notifyNoise: checked })}
            />
            <PrefRow
              label="Telegram copy"
              hint={
                data.telegramConfigured
                  ? "Live bot token detected"
                  : "Simulated in this demo"
              }
              checked={data.prefs.telegramEnabled}
              onChange={(checked) => void patchPrefs({ telegramEnabled: checked })}
            />
          </div>
        </aside>

        <section className="flex min-h-[70vh] flex-col border-b border-border/70 lg:border-r lg:border-b-0">
          <Tabs value={channel} onValueChange={setChannel} className="flex min-h-0 flex-1">
            <div className="flex items-center gap-3 px-4 pt-3">
              <TabsList>
                <TabsTrigger value="desk">Website desk</TabsTrigger>
                <TabsTrigger value="telegram">Telegram bot</TabsTrigger>
              </TabsList>
              {watching ? (
                <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-[var(--action)]">
                  <RadioIcon className="size-3.5 animate-pulse" />
                  Live
                </span>
              ) : (
                <span className="ml-auto text-xs text-muted-foreground">
                  {data.queueRemaining} still in the mailbag
                </span>
              )}
            </div>

            <TabsContent value="desk" className="flex min-h-0 flex-1 flex-col">
              <div className="px-4 py-3">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Filter knocks"
                  aria-label="Filter knocks"
                />
              </div>
              <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
                {loading ? (
                  <div className="flex items-center gap-2 px-4 py-12 text-sm text-muted-foreground">
                    <Loader2Icon className="size-4 animate-spin" />
                    Clerk is opening the mailbox…
                  </div>
                ) : visible.length === 0 ? (
                  <div className="mx-3 rounded-2xl border border-dashed border-border px-5 py-12 text-center">
                    <InboxIcon className="mx-auto mb-3 size-7 text-muted-foreground" />
                    <p className="font-heading text-xl">Mailbox is quiet</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Nothing in this filter needs you. Watch the mailbox or pull
                      the next letter.
                    </p>
                    <button
                      type="button"
                      onClick={() => void arrive(false)}
                      className={cn(buttonVariants({ size: "sm" }), "mt-4")}
                    >
                      Pull next letter
                    </button>
                  </div>
                ) : (
                  visible.map((letter) => (
                    <FeedMessage
                      key={letter.id}
                      letter={letter}
                      active={letter.id === selectedId}
                      onSelect={() =>
                        selectLetter(letter.id, window.matchMedia("(max-width: 1023px)").matches)
                      }
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="telegram" className="px-4 py-4">
              <TelegramPhone
                messages={data.telegram}
                letters={data.letters}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="hidden min-h-[70vh] lg:block">
          <LetterPane letter={selected} />
        </section>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="h-[88vh] sm:max-w-none">
          <SheetHeader>
            <SheetTitle className="sr-only">Letter</SheetTitle>
          </SheetHeader>
          <div className="-mt-6 h-full overflow-y-auto">
            <LetterPane letter={selected} compact />
          </div>
        </SheetContent>
      </Sheet>

      <footer className="border-t border-border/70 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        Demo mailbox — no Gmail login required. Wire a real inbox later with Gmail
        push + a Telegram bot token.{" "}
        <Link href="/how" className="text-foreground underline-offset-2 hover:underline">
          How a live version works
        </Link>
      </footer>
    </div>
  )
}

function PrefRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span>
        <span className="block">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}
