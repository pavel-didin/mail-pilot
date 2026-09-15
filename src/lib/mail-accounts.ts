export type MailAccount = {
  host: string
  port: number
  user: string
  pass: string
}

export function listMailAccounts(): MailAccount[] {
  const accounts: MailAccount[] = []
  for (let index = 1; index <= 20; index += 1) {
    const user = process.env[`MAIL_${index}_USER`]?.trim()
    const pass = process.env[`MAIL_${index}_PASS`]
    if (!user || !pass) continue
    accounts.push({
      host: process.env[`MAIL_${index}_HOST`]?.trim() || inferHost(user),
      port: Number(process.env[`MAIL_${index}_PORT`] || 993),
      user,
      pass,
    })
  }
  return accounts
}

function inferHost(user: string) {
  const domain = user.split("@")[1]?.toLowerCase() ?? ""
  if (domain === "gmail.com" || domain === "googlemail.com") return "imap.gmail.com"
  if (domain === "mail.ru" || domain === "inbox.ru" || domain === "list.ru" || domain === "bk.ru") {
    return "imap.mail.ru"
  }
  if (domain === "yandex.ru" || domain === "yandex.com" || domain === "ya.ru") {
    return "imap.yandex.com"
  }
  if (
    domain === "outlook.com" ||
    domain === "hotmail.com" ||
    domain === "live.com"
  ) {
    return "outlook.office365.com"
  }
  return `imap.${domain}`
}
