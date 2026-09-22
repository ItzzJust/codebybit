import { cache } from "@/lib/cache";

export interface RateLimitOptions {
  /** Maximum requests allowed within the window. */
  limit: number;
  /** Window size in seconds. Default: 60. */
  windowSeconds?: number;
  /** Cache key prefix. Default: "rl:". */
  prefix?: string;
}

const DEFAULT_WINDOW_SECONDS = 60;
const DEFAULT_PREFIX = "rl:";

/**
 * Fixed-window rate limiter backed by Redis.
 * Returns `true` when the request is allowed, `false` when it exceeds the limit.
 * Degrades to allowing requests when Redis is unavailable (cache is non-critical),
 * so a Redis outage never takes the whole API down.
 */
export async function rateLimit(
  key: string,
  {
    limit,
    windowSeconds = DEFAULT_WINDOW_SECONDS,
    prefix = DEFAULT_PREFIX,
  }: RateLimitOptions
): Promise<boolean> {
  if (limit <= 0) {
    return false;
  }

  // Fixed window bucket — resets every `windowSeconds`.
  const window = Math.floor(Date.now() / (windowSeconds * 1000));
  const bucketKey = `${key}:${window}`;

  const current = await cache.get<number>(bucketKey, {
    prefix,
    ttl: windowSeconds,
  });
  if (current !== null && current >= limit) {
    return false;
  }

  await cache.set(bucketKey, (current ?? 0) + 1, {
    prefix,
    ttl: windowSeconds,
  });
  return true;
}
