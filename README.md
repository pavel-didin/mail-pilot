# Letterdesk

Stop checking every inbox. Letterdesk is a website (and a Telegram-shaped bot) that watches incoming mail, keeps noise off your phone, and knocks only when a letter actually needs you. One click opens the original.

This is a working demo with a scripted researcher mailbox. You do not need Gmail or a Telegram token to try the habit.

## Is this real?

Yes. The live version is the same loop:

1. **Watch mail** with Gmail API + Pub/Sub (or IMAP IDLE).
2. **Triage** each new letter into urgent / needs you / FYI / noise, plus a two-line summary.
3. **Knock once** on this website and/or a Telegram bot. The message has an **Open letter** button: Gmail search on the real mailbox, or `/letter/[id]` in this demo.

You still grant mailbox access, write a privacy note, and tune filters. Do not auto-reply until summaries have earned trust.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

- **Watch mailbox** — new letters arrive every few seconds.
- **Pull next letter** — one arrival on demand.
- **Open letter** — Clerk’s summary plus the original on paper.
- **Telegram view** — the same knocks as a chat bot with a one-tap button.
- **Reset demo** — refill the mailbag.

## Optional live Telegram

If you create a bot with [@BotFather](https://t.me/BotFather) and know your chat id:

```bash
TELEGRAM_BOT_TOKEN=123:abc
TELEGRAM_CHAT_ID=your-chat-id
NEXT_PUBLIC_APP_URL=https://your-public-host
```

Clerk will try a real `sendMessage` with an inline **Open letter** button. Without these, Telegram stays simulated in the phone UI.

## Stack

Next.js, TypeScript, Tailwind, shadcn/ui. Mail lives in memory for the demo — restarting the server resets it unless you click Reset anyway.
