import { gmailSearchUrl } from "@/lib/gmail"
import { llmConfig, triageLetter } from "@/lib/llm"
import { listMailAccounts } from "@/lib/mail-accounts"
import { ARRIVAL_QUEUE, INITIAL_MAIL, type ScriptedMail } from "@/lib/mock-mail"
import { shouldNotify, triage } from "@/lib/triage"
import type { InboxSnapshot, Letter, Prefs, RawEmail, TelegramMessage } from "@/lib/types"
import { deliverTelegram } from "@/lib/telegram"

const defaultPrefs: Prefs = {
  notifyUrgent: true,
  notifyAction: true,
  notifyFyi: true,
  notifyNoise: false,
  telegramEnabled: true,
}

function cloneQueue() {
  return ARRIVAL_QUEUE.map((item) => ({ ...item, triage: { ...item.triage } }))
}

function toLetter(
  script: ScriptedMail,
  receivedAt: string,
  id: string,
  result: ReturnType<typeof triage>
): Letter {
  return {
    id,
    fromName: script.fromName,
    fromEmail: script.fromEmail,
    subject: script.subject,
    body: script.body,
    account: script.account,
    receivedAt,
    priority: result.priority,
    summary: result.summary,
    why: result.why,
    suggestedAction: result.suggestedAction,
    notified: false,
    read: false,
    muted: false,
    gmailUrl: gmailSearchUrl(script.fromEmail, script.subject),
  }
}

class MailboxStore {
  letters: Letter[] = []
  queue: ScriptedMail[] = []
  prefs: Prefs = { ...defaultPrefs }
  telegram: TelegramMessage[] = []
  seq = 0

  constructor() {
    this.reset()
  }

  reset() {
    const now = Date.now()
    this.seq = 0
    this.prefs = { ...defaultPrefs }
    this.telegram = []
    this.queue = cloneQueue()
    if (listMailAccounts().length > 0) {
      this.letters = []
      this.queue = []
      return
    }
    this.letters = INITIAL_MAIL.map((script, index) => {
      const letter = toLetter(
        script,
        new Date(now - (INITIAL_MAIL.length - index) * 36 * 60_000).toISOString(),
        this.nextId(),
        script.triage ?? triage(script)
      )
      return this.applyNotify(letter)
    }).reverse()
  }

  nextId() {
    this.seq += 1
    return `ltr_${this.seq}`
  }

  snapshot(): InboxSnapshot {
    return {
      letters: this.letters,
      queueRemaining: this.queue.length,
      prefs: this.prefs,
      telegramConfigured: Boolean(
        process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
      ),
      llmConfigured: llmConfig().configured,
      llmModel: llmConfig().model,
      mailboxCount: listMailAccounts().length,
      telegram: this.telegram,
    }
  }

  get(id: string) {
    return this.letters.find((letter) => letter.id === id)
  }

  setPrefs(patch: Partial<Prefs>) {
    this.prefs = { ...this.prefs, ...patch }
    return this.prefs
  }

  update(id: string, patch: Partial<Pick<Letter, "read" | "muted">>) {
    const letter = this.get(id)
    if (!letter) return null
    Object.assign(letter, patch)
    return letter
  }

  applyNotify(letter: Letter) {
    const ping = !letter.muted && shouldNotify(letter.priority, this.prefs)
    letter.notified = ping
    if (ping && this.prefs.telegramEnabled) {
      const message: TelegramMessage = {
        id: `tg_${letter.id}`,
        letterId: letter.id,
        text: telegramText(letter),
        buttonLabel: "Open letter",
        buttonUrl: `/letter/${letter.id}`,
        sentAt: letter.receivedAt,
        delivered: "simulated",
      }
      this.telegram = [message, ...this.telegram.filter((item) => item.letterId !== letter.id)]
      void deliverTelegram(letter).then((result) => {
        if (result.delivered) {
          const found = this.telegram.find((item) => item.id === message.id)
          if (found) found.delivered = "telegram"
        }
      })
    }
    return letter
  }

  async arrive() {
    const script = this.queue.shift()
    if (!script) return { letter: null as Letter | null, exhausted: true }
    const result = await triageLetter(script)
    const letter = toLetter(script, new Date().toISOString(), this.nextId(), result)
    this.applyNotify(letter)
    this.letters = [letter, ...this.letters]
    return { letter, exhausted: this.queue.length === 0 }
  }

  async ingest(raw: RawEmail) {
    const result = await triageLetter(raw)
    const letter = toLetter(
      {
        ...raw,
        triage: result,
      },
      new Date().toISOString(),
      this.nextId(),
      result
    )
    this.applyNotify(letter)
    this.letters = [letter, ...this.letters]
    return letter
  }
}

function telegramText(letter: Letter) {
  const flag =
    letter.priority === "urgent"
      ? "Urgent"
      : letter.priority === "action"
        ? "Needs you"
        : letter.priority === "fyi"
          ? "FYI"
          : "Quiet"
  return `${flag} · ${letter.fromName}\n${letter.summary}`
}

const globalForStore = globalThis as typeof globalThis & {
  __letterdesk?: MailboxStore
}

export function getStore() {
  if (!globalForStore.__letterdesk) {
    globalForStore.__letterdesk = new MailboxStore()
  }
  return globalForStore.__letterdesk
}
