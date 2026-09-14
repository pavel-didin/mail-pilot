import type { Letter } from "@/lib/types"

export async function deliverTelegram(letter: Letter) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    return { delivered: false as const, reason: "not_configured" }
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:43147"
  const url = `${origin}/letter/${letter.id}`
  const flag =
    letter.priority === "urgent"
      ? "Urgent"
      : letter.priority === "action"
        ? "Needs you"
        : letter.priority === "fyi"
          ? "FYI"
          : "Quiet"

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `<b>${flag}</b> · ${escapeHtml(letter.fromName)}\n${escapeHtml(letter.summary)}`,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [[{ text: "Open letter", url }]],
      },
    }),
  })

  if (!response.ok) {
    return { delivered: false as const, reason: "telegram_error" }
  }

  return { delivered: true as const }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
