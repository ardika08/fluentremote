/**
 * Simple in-memory sliding window rate limiter.
 *
 * Suitable for single-process Next.js deployments (VPS/standalone).
 * For multi-instance deployments, replace with Redis-backed limiter.
 *
 * Usage:
 *   const limiter = getRateLimiter("translate", { limit: 30, windowMs: 60_000 });
 *   const result = limiter.check(identifier);
 *   if (!result.allowed) return 429;
 */

type RateLimiterOptions = {
  /** Max requests allowed in the window */
  limit: number;
  /** Window size in milliseconds */
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix ms timestamp
};

type WindowEntry = {
  timestamps: number[];
};

const stores = new Map<string, Map<string, WindowEntry>>();

function getStore(name: string): Map<string, WindowEntry> {
  if (!stores.has(name)) {
    stores.set(name, new Map());
  }
  return stores.get(name)!;
}

export function getRateLimiter(name: string, options: RateLimiterOptions) {
  const { limit, windowMs } = options;

  return {
    check(identifier: string): RateLimitResult {
      const store = getStore(name);
      const now = Date.now();
      const windowStart = now - windowMs;

      const entry = store.get(identifier) ?? { timestamps: [] };

      // Slide the window — drop timestamps older than windowStart
      entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

      const resetAt = (entry.timestamps[0] ?? now) + windowMs;

      if (entry.timestamps.length >= limit) {
        store.set(identifier, entry);
        return { allowed: false, remaining: 0, resetAt };
      }

      entry.timestamps.push(now);
      store.set(identifier, entry);

      return {
        allowed: true,
        remaining: limit - entry.timestamps.length,
        resetAt,
      };
    },
  };
}

/**
 * Extracts a stable identifier from a request for rate limiting.
 * Prefers X-Forwarded-For (behind proxy/Nginx), falls back to direct IP.
 */
export function getRateLimitIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }
  return "unknown";
}
