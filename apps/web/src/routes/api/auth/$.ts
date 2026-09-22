import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth";
import { clientIp } from "@/lib/http-guards";
import { rateLimit } from "@/lib/rate-limit";

const AUTH_POST_LIMIT = 30;
const AUTH_GET_LIMIT = 120;
const AUTH_WINDOW_SECONDS = 60;

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const allowed = await rateLimit(`auth:get:${clientIp(request)}`, {
          limit: AUTH_GET_LIMIT,
          windowSeconds: AUTH_WINDOW_SECONDS,
        });
        if (!allowed) {
          return new Response("Too many requests", { status: 429 });
        }
        return auth.handler(request);
      },

      POST: async ({ request }) => {
        // Brute-force protection for sign-in / sign-up / password flows.
        const allowed = await rateLimit(`auth:post:${clientIp(request)}`, {
          limit: AUTH_POST_LIMIT,
          windowSeconds: AUTH_WINDOW_SECONDS,
        });
        if (!allowed) {
          return new Response("Too many requests", {
            status: 429,
            headers: { "Retry-After": String(AUTH_WINDOW_SECONDS) },
          });
        }
        return auth.handler(request);
      },
    },
  },
});
