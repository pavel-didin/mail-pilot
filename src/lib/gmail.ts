export function gmailSearchUrl(fromEmail: string, subject: string) {
  const query = `from:${fromEmail} subject:${subject}`
  return `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(query)}`
}

export function letterUrl(id: string) {
  return `/letter/${id}`
}
