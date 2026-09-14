import type { Priority, RawEmail, TriageResult } from "@/lib/types"

const NOISE_HINTS = [
  "unsubscribe",
  "newsletter",
  "weekly digest",
  "daily digest",
  "viewed your profile",
  "no-reply",
  "noreply",
  "promotion",
  "percent off",
  "dependabot",
  "you have a new follower",
]

const URGENT_HINTS = [
  "payment failed",
  "security alert",
  "new sign-in",
  "flight",
  "cancelled",
  "today",
  "tomorrow",
  "deadline",
  "due today",
  "asap",
  "urgent",
]

const ACTION_HINTS = [
  "could you",
  "can you",
  "please review",
  "please",
  "need your",
  "comments",
  "revision",
  "rsvp",
  "meeting",
  "move",
  "budget",
  "review request",
]

function firstSentences(body: string, count = 2) {
  const parts = body
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
  return parts.slice(0, count).join(" ")
}

function haystack(raw: RawEmail) {
  return `${raw.subject} ${raw.fromName} ${raw.fromEmail} ${raw.body}`.toLowerCase()
}

export function triage(raw: RawEmail): TriageResult {
  const hay = haystack(raw)
  const snippet = firstSentences(raw.body)

  if (NOISE_HINTS.some((hint) => hay.includes(hint))) {
    return {
      priority: "noise",
      summary: `${raw.fromName} sent “${raw.subject}”. Clerk filed it as noise.`,
      why: "Looks like a newsletter, notification, or promo — not a person waiting on you.",
      suggestedAction: "Leave it. Open only if the subject is unexpectedly personal.",
    }
  }

  if (URGENT_HINTS.some((hint) => hay.includes(hint))) {
    return {
      priority: "urgent",
      summary: snippet || `${raw.fromName}: ${raw.subject}`,
      why: "Deadline, travel, money, or security language. Waiting usually costs something.",
      suggestedAction: "Open the original letter and act or confirm it is a false alarm.",
    }
  }

  if (ACTION_HINTS.some((hint) => hay.includes(hint))) {
    return {
      priority: "action",
      summary: snippet || `${raw.fromName} is asking for something: ${raw.subject}`,
      why: "Someone is waiting on a reply, review, or decision.",
      suggestedAction: "Read the ask, then reply from Gmail in one hop.",
    }
  }

  return {
    priority: "fyi",
    summary: snippet || `${raw.fromName}: ${raw.subject}`,
    why: "Informational. No clear deadline or request.",
    suggestedAction: "Skim the summary. Open the letter only if you care.",
  }
}

export function shouldNotify(priority: Priority, prefs: {
  notifyUrgent: boolean
  notifyAction: boolean
  notifyFyi: boolean
  notifyNoise: boolean
}) {
  if (priority === "urgent") return prefs.notifyUrgent
  if (priority === "action") return prefs.notifyAction
  if (priority === "fyi") return prefs.notifyFyi
  return prefs.notifyNoise
}
