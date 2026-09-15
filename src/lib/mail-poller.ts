import { ImapFlow } from "imapflow"

import { listMailAccounts, type MailAccount } from "@/lib/mail-accounts"
import { getStore } from "@/lib/store"
import type { RawEmail } from "@/lib/types"

const seen = new Set<string>()

export function startMailPoller() {
  const accounts = listMailAccounts()
  if (accounts.length === 0) {
    console.info("[letterdesk] No MAIL_N_USER accounts; demo mailbox only.")
    return
  }

  const seconds = Math.max(30, Number(process.env.MAIL_POLL_SECONDS || 60))
  console.info(
    `[letterdesk] Watching ${accounts.length} IMAP account(s) every ${seconds}s.`
  )

  void pollAll(accounts)
  setInterval(() => {
    void pollAll(accounts)
  }, seconds * 1000)
}

async function pollAll(accounts: MailAccount[]) {
  for (const account of accounts) {
    try {
      await pollOne(account)
    } catch (error) {
      const message = error instanceof Error ? error.message : "IMAP error"
      console.error(`[letterdesk] ${account.user}: ${message}`)
    }
  }
}

async function pollOne(account: MailAccount) {
  const client = new ImapFlow({
    host: account.host,
    port: account.port,
    secure: true,
    auth: { user: account.user, pass: account.pass },
    logger: false,
  })

  await client.connect()
  try {
    const lock = await client.getMailboxLock("INBOX")
    try {
      for await (const message of client.fetch(
        { seen: false },
        { uid: true, envelope: true, source: { maxLength: 24_000 } }
      )) {
        const key = `${account.user}:${message.uid}`
        if (seen.has(key)) continue
        seen.add(key)

        const raw = toRawEmail(account.user, {
          envelope: message.envelope,
          source: message.source,
        })
        if (!raw) continue
        await getStore().ingest(raw)
        await client.messageFlagsAdd([message.uid], ["\\Seen"], { uid: true })
      }
    } finally {
      lock.release()
    }
  } finally {
    await client.logout().catch(() => undefined)
  }
}

function toRawEmail(
  account: string,
  message: { envelope?: { subject?: string; from?: { name?: string; address?: string }[] }; source?: Buffer }
): RawEmail | null {
  const from = message.envelope?.from?.[0]
  const fromEmail = from?.address
  if (!fromEmail) return null
  const body = extractText(message.source?.toString("utf8") ?? "")
  return {
    account,
    fromName: from?.name || fromEmail.split("@")[0],
    fromEmail,
    subject: message.envelope?.subject || "(no subject)",
    body: body.slice(0, 8000) || "(empty body)",
  }
}

function extractText(raw: string) {
  const unlabeled = raw.replace(/\r\n/g, "\n")
  const textPart = unlabeled.split(/Content-Type: text\/plain[^\n]*\n(?:[^\n]+:[^\n]*\n)*\n/i)[1]
  const chunk = (textPart ?? unlabeled).split(/\n--/)[0]
  return chunk
    .replace(/^[\s\S]*?\n\n/, "")
    .replace(/=\n/g, "")
    .replace(/=([0-9A-F]{2})/gi, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16))
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
