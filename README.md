# Letterdesk

Stop checking every inbox. Letterdesk is a website (and a Telegram bot) that watches incoming mail, keeps noise off your phone, and knocks only when a letter actually needs you. One click opens the original.

This repo can watch several real IMAP inboxes (Gmail, Mail.ru, Yandex, Outlook), summarize with an LLM, and knock on Telegram. Without `MAIL_1_USER` it uses a demo bag.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

- **Watch mailbox** / **Pull next letter** — demo letters arrive; if `LLM_API_KEY` is set, Clerk asks the model to summarize each one.
- **Telegram view** — the same knocks as a chat bot.

## Install on a remote server

You need: Ubuntu (or similar), **1 vCPU / 1–2 GB RAM / 5 GB disk**, Node 22 (or Docker), a domain with **HTTPS** if you want Telegram buttons to work.

### 1. Copy the code

```bash
sudo mkdir -p /opt/mail-pilot
sudo chown "$USER:$USER" /opt/mail-pilot
cd /opt/mail-pilot
git clone https://github.com/pavel-didin/mail-pilot.git .
# or: origin repo clone pavel-didin/mail-pilot
```

### 2. Environment

```bash
cp .env.example .env
nano .env
```

Set at least:

```bash
NEXT_PUBLIC_APP_URL=https://mail.your-domain.com
```

Then optional Telegram + LLM (see below).

### 3a. Docker (simplest)

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker "$USER"   # log out and back in
docker compose up -d --build
```

The app listens on port **43147**. Point nginx (or Caddy) at it.

### 3b. systemd without Docker

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
cd /opt/mail-pilot
npm ci
npm run build
sudo cp deploy/letterdesk.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now letterdesk
```

The unit file assumes the app lives at `/opt/mail-pilot` and runs as `www-data`. Change `User=` if needed (`sudo chown -R www-data:www-data /opt/mail-pilot`).

### 4. HTTPS reverse proxy (Caddy example)

```bash
sudo apt install -y caddy
```

`/etc/caddy/Caddyfile`:

```
mail.your-domain.com {
  reverse_proxy 127.0.0.1:43147
}
```

```bash
sudo systemctl reload caddy
```

Telegram inline **Open letter** buttons only work with a public `https://` URL in `NEXT_PUBLIC_APP_URL`. Rebuild/restart after changing that variable (`NEXT_PUBLIC_*` is baked in at `npm run build`).

## Connect an LLM API

Clerk talks to any **OpenAI-compatible** Chat Completions endpoint. No extra packages.

In `.env`:

```bash
LLM_API_KEY=sk-your-key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
```

| Provider | `LLM_BASE_URL` | Example `LLM_MODEL` |
|---|---|---|
| OpenAI | `https://api.openai.com/v1` | `gpt-4o-mini` |
| OpenRouter | `https://openrouter.ai/api/v1` | `openai/gpt-4o-mini` |
| Groq | `https://api.groq.com/openai/v1` | `llama-3.1-8b-instant` |
| Together | `https://api.together.xyz/v1` | `meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo` |
| Local llama.cpp / vLLM | `http://127.0.0.1:8080/v1` | whatever that server exposes |

`OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL` work as aliases.

Restart the process. On the desk, the left column should say **Summaries: LLM (model-name)**. Click **Pull next letter** — Clerk calls the API and uses that summary (if the API fails, it falls back to local rules).

Mail itself is still the demo bag until you add Gmail/IMAP. The LLM path is already live on each arrival.

## Connect Telegram

1. In Telegram, talk to [@BotFather](https://t.me/BotFather) → `/newbot` → copy the token.
2. Open your bot and press Start.
3. Get your chat id: message [@userinfobot](https://t.me/userinfobot) or call  
   `https://api.telegram.org/bot<TOKEN>/getUpdates` after sending the bot a message.
4. Put them in `.env`:

```bash
TELEGRAM_BOT_TOKEN=123456:AA...
TELEGRAM_CHAT_ID=123456789
NEXT_PUBLIC_APP_URL=https://mail.your-domain.com
```

Restart. Pull a letter that is not noise. You should get a Telegram message with **Open letter**.

## Stack

Next.js, TypeScript, Tailwind, shadcn/ui. Demo mail is in memory — a process restart empties it unless you click Reset after boot anyway.
