import { getStore } from "@/lib/store"

export async function POST() {
  const store = getStore()
  const result = store.arrive()
  return Response.json({
    ...result,
    snapshot: store.snapshot(),
  })
}
