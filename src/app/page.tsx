import { InboxDesk } from "@/components/inbox-desk"
import { getStore } from "@/lib/store"

export default function Home() {
  return <InboxDesk initial={getStore().snapshot()} />
}
