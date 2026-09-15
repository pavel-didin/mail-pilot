import { triage } from "@/lib/triage"
import type { Priority, RawEmail, TriageResult } from "@/lib/types"

const PRIORITIES: Priority[] = ["urgent", "action", "fyi", "noise"]

export function llmConfig() {
  const apiKey = process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || ""
  const baseUrl = (
    process.env.LLM_BASE_URL ||
    process.env.OPENAI_BASE_URL ||
    "https://api.openai.com/v1"
  ).replace(/\/$/, "")
  const model =
    process.env.LLM_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini"
  return { apiKey, baseUrl, model, configured: Boolean(apiKey) }
}

export async function triageLetter(raw: RawEmail): Promise<TriageResult> {
  const fallback = triage(raw)
  const { apiKey, baseUrl, model, configured } = llmConfig()
  if (!configured) return fallback

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are Clerk, a terse mail clerk for a researcher. Classify each letter. Return JSON only with keys priority, summary, why, suggestedAction. priority must be one of urgent, action, fyi, noise. summary is at most two sentences. Do not invent facts that are not in the letter.",
          },
          {
            role: "user",
            content: [
              `Account: ${raw.account}`,
              `From: ${raw.fromName} <${raw.fromEmail}>`,
              `Subject: ${raw.subject}`,
              "",
              raw.body,
            ].join("\n"),
          },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    })

    if (!response.ok) return fallback
    const payload = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const content = payload.choices?.[0]?.message?.content
    const parsed = parseTriage(content)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function parseTriage(content: string | undefined): TriageResult | null {
  if (!content) return null
  const start = content.indexOf("{")
  const end = content.lastIndexOf("}")
  if (start < 0 || end <= start) return null
  try {
    const data = JSON.parse(content.slice(start, end + 1)) as Partial<TriageResult>
    if (!PRIORITIES.includes(data.priority as Priority)) return null
    if (!data.summary || !data.why || !data.suggestedAction) return null
    return {
      priority: data.priority as Priority,
      summary: String(data.summary).slice(0, 400),
      why: String(data.why).slice(0, 400),
      suggestedAction: String(data.suggestedAction).slice(0, 400),
    }
  } catch {
    return null
  }
}
