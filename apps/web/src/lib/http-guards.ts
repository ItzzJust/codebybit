/**
 * Best-effort client IP from common proxy headers.
 * Falls back to "unknown" when none are present.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Reject cross-site requests on state-changing endpoints (CSRF defense).
 * Uses Sec-Fetch-Site when the browser sends it, falling back to Origin.
 * Non-browser clients (curl, server-to-server) that send neither are allowed.
 */
export function isSameOrigin(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  const url = new URL(request.url);
  const originUrl = new URL(origin);
  return originUrl.origin === url.origin;
}
