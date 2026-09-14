import type { Priority } from "@/lib/types"

export function formatRelative(iso: string, now = Date.now()) {
  const then = new Date(iso).getTime()
  const delta = Math.max(0, now - then)
  const minutes = Math.floor(delta / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function formatClock(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const priorityLabel: Record<Priority, string> = {
  urgent: "Urgent",
  action: "Needs you",
  fyi: "FYI",
  noise: "Quiet",
}

export const priorityHint: Record<Priority, string> = {
  urgent: "Time-sensitive. Open it.",
  action: "A reply or decision is expected.",
  fyi: "Useful, not blocking.",
  noise: "Clerk kept this off your phone.",
}
