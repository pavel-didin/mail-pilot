export type Priority = "urgent" | "action" | "fyi" | "noise"

export type TriageResult = {
  priority: Priority
  summary: string
  why: string
  suggestedAction: string
}

export type RawEmail = {
  fromName: string
  fromEmail: string
  subject: string
  body: string
  account: string
}

export type Letter = {
  id: string
  fromName: string
  fromEmail: string
  subject: string
  body: string
  account: string
  receivedAt: string
  priority: Priority
  summary: string
  why: string
  suggestedAction: string
  notified: boolean
  read: boolean
  muted: boolean
  gmailUrl: string
}

export type Prefs = {
  notifyUrgent: boolean
  notifyAction: boolean
  notifyFyi: boolean
  notifyNoise: boolean
  telegramEnabled: boolean
}

export type TelegramMessage = {
  id: string
  letterId: string
  text: string
  buttonLabel: string
  buttonUrl: string
  sentAt: string
  delivered: "simulated" | "telegram"
}

export type InboxSnapshot = {
  letters: Letter[]
  queueRemaining: number
  prefs: Prefs
  telegramConfigured: boolean
  telegram: TelegramMessage[]
}
