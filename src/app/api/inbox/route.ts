import { getStore } from "@/lib/store"
import type { Prefs } from "@/lib/types"

export async function GET() {
  return Response.json(getStore().snapshot())
}

export async function PATCH(request: Request) {
  const patch = (await request.json()) as Partial<Prefs>
  const store = getStore()
  store.setPrefs(patch)
  return Response.json(store.snapshot())
}

export async function DELETE() {
  const store = getStore()
  store.reset()
  return Response.json(store.snapshot())
}
