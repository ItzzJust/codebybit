import Redis from "ioredis";

const { REDIS_URL } = process.env;

let client: Redis | null = null;
let lastErrorLog = 0;
// Max once per minute
const ERROR_LOG_THROTTLE_MS = 60_000;

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

/**
 * Sentinel persisted (as JSON) when a computed value is `null`, so cached
 * empty results and cache misses can be told apart (negative caching).
 */
const NULL_SENTINEL = "__CACHE_NULL__";

/** In-flight computations keyed by cache key — coalesces concurrent misses (thundering herd). */
const inflight = new Map<string, Promise<unknown>>();

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
      const scanStream = redis.scanStream({ count: 100, match: fullPattern });
      const keysToDelete: string[] = [];

      for await (const batch of scanStream) {
        for (const key of batch) {
          keysToDelete.push(key);
        }
      }

      if (keysToDelete.length > 0) {
        await redis.del(...keysToDelete);
      }
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
   *
   * `null` results are cached too (via a sentinel), so data that doesn't exist
   * can't hammer the database on every request. Concurrent misses for the same
   * key share a single in-flight computation.
   */
  async getOrSet<T>(
    key: string,
    compute: () => Promise<T>,
    opts: CacheOptions = {}
  ): Promise<T> {
    const cached = await cache.get<T>(key, opts);
    if (cached !== null) {
      // SAFETY: getOrSet persists either a JSON value or the null sentinel, so
      // a non-null cached result is a genuine T (or null via the sentinel).
      return (cached === NULL_SENTINEL ? null : cached) as T;
    }

    const existing = inflight.get(key);
    if (existing) {
      // SAFETY: inflight only stores promises created by getOrSet for the same
      // key, so the in-flight computation is a Promise<T>.
      return existing as Promise<T>;
    }

    const promise = (async () => {
      try {
        const value = await compute();
        // Store `null` results as the sentinel so they're distinguishable from a miss.
        const stored =
          value === null
            ? JSON.stringify(NULL_SENTINEL)
            : JSON.stringify(value);
        await cache.set(key, stored, opts);
        return value;
      } finally {
        inflight.delete(key);
      }
    })();

    inflight.set(key, promise);
    return promise;
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
