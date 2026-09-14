import { getStore } from "@/lib/store"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const letter = getStore().get(id)
  if (!letter) {
    return Response.json({ error: "Letter not found" }, { status: 404 })
  }
  return Response.json({ letter })
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const patch = (await request.json()) as { read?: boolean; muted?: boolean }
  const letter = getStore().update(id, patch)
  if (!letter) {
    return Response.json({ error: "Letter not found" }, { status: 404 })
  }
  return Response.json({ letter, snapshot: getStore().snapshot() })
}
