import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react"

import { LetterPane } from "@/components/letter-pane"
import { Mark } from "@/components/mark"
import { buttonVariants } from "@/components/ui/button"
import { getStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default async function LetterPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const letter = getStore().get(id)
  if (!letter) notFound()

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col">
      <header className="flex items-center gap-3 px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Mark className="size-7" />
          <span className="font-heading text-lg">Letterdesk</span>
        </Link>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "ml-auto")}
        >
          <ArrowLeftIcon data-icon="inline-start" />
          Back to knocks
        </Link>
        <a
          href={letter.gmailUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ size: "sm" }))}
        >
          Open in Gmail
          <ExternalLinkIcon data-icon="inline-end" />
        </a>
      </header>
      <div className="flex-1 pb-10">
        <LetterPane letter={letter} hideOpenLink />
      </div>
    </div>
  )
}
