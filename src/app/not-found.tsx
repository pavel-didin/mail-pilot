import Link from "next/link"

import { Mark } from "@/components/mark"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <Mark />
      <h1 className="mt-4 font-heading text-3xl">That letter is gone</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Clerk only keeps the current demo mailbox in memory. Reset the desk and
        pull mail again.
      </p>
      <Link href="/" className={cn(buttonVariants(), "mt-6")}>
        Back to knocks
      </Link>
    </div>
  )
}
