export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startMailPoller } = await import("@/lib/mail-poller")
    startMailPoller()
  }
}
