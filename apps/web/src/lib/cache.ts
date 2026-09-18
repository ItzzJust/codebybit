import Redis from "ioredis";

const { REDIS_URL } = process.env;

let client: Redis | null = null;
let lastErrorLog = 0;
const ERROR_LOG_THROTTLE_MS = 60_000; // Max once per minute

function logError(msg: string) {
  const now = Date.now();
  if (now - lastErrorLog > ERROR_LOG_THROTTLE_MS) {
    lastErrorLog = now;
    console.error(`[cache] ${msg}`);
  }
}

function getClient(): Redis | null {
  if (!REDIS_URL) {
    return null;
  }

  if (!client) {
    client = new Redis(REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    client.on("error", (err) => {
      logError(`Redis connection error: ${err.message}`);
    });
  }

  return client;
}

export interface CacheOptions {
  /** Cache key prefix. Default: "cb:" */
  prefix?: string;
  /** TTL in seconds. Default: 60 (1 minute) */
  ttl?: number;
}

const DEFAULT_PREFIX = "cb:";
const DEFAULT_TTL = 60;

export const cache = {
  /**
   * Delete a cached value by key.
   */
  async del(key: string, opts: CacheOptions = {}): Promise<void> {
    const redis = getClient();
    if (!redis) {
      return;
    }

    try {
      const fullKey = `${opts.prefix ?? DEFAULT_PREFIX}${key}`;
      await redis.del(fullKey);
    } catch {
      // Silently fail
    }
  },

  /**
   * Delete all keys matching a pattern using SCAN (O(1) per batch, non-blocking).
   */
  async delPattern(pattern: string, opts: CacheOptions = {}): Promise<void> {
    const redis = getClient();
    if (!redis) {
      return;
    }

    try {
      const fullPattern = `${opts.prefix ?? DEFAULT_PREFIX}${pattern}`;
      let cursor = "0";

      do {
        const [nextCursor, keys] = await redis.scan(
          cursor,
          "MATCH",
          fullPattern,
          "COUNT",
          100
        );
        cursor = nextCursor;

        if (keys.length > 0) {
          await redis.del(...keys);
        }
      } while (cursor !== "0");
    } catch {
      // Silently fail
    }
  },

  /**
   * Get a cached value by key.
   * Returns null if not found or if Redis is unavailable.
   */
  async get<T>(key: string, opts: CacheOptions = {}): Promise<T | null> {
    const redis = getClient();
    if (!redis) {
      return null;
    }

    try {
      const fullKey = `${opts.prefix ?? DEFAULT_PREFIX}${key}`;
      const raw = await redis.get(fullKey);
      if (!raw) {
        return null;
      }
      // SAFETY: We store JSON.stringify'd values, so parsing should produce the same type.
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  /**
   * Cache-aside pattern: get from cache, or compute and store.
   */
  async getOrSet<T>(
    key: string,
    compute: () => Promise<T>,
    opts: CacheOptions = {}
  ): Promise<T> {
    const cached = await cache.get<T>(key, opts);
    if (cached !== null) {
      return cached;
    }

    const value = await compute();
    await cache.set(key, value, opts);
    return value;
  },

  /**
   * Set a value in cache.
   * Silently fails if Redis is unavailable.
   */
  async set<T>(key: string, value: T, opts: CacheOptions = {}): Promise<void> {
    const redis = getClient();
    if (!redis) {
      return;
    }

    try {
      const fullKey = `${opts.prefix ?? DEFAULT_PREFIX}${key}`;
      const ttl = opts.ttl ?? DEFAULT_TTL;
      await redis.setex(fullKey, ttl, JSON.stringify(value));
    } catch {
      // Silently fail — cache is non-critical
    }
  },
};
