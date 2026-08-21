import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";

/**
 * Server-only environment variables, validated at module load with T3 Env
 * (Valibot schemas via the Standard Schema spec). Import this file from
 * server code only — the variables below must never reach the client bundle.
 */
export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    BETTER_AUTH_SECRET: v.pipe(v.string(), v.minLength(32)),
    BETTER_AUTH_URL: v.pipe(v.string(), v.url()),
    DATABASE_URL: v.pipe(v.string(), v.minLength(1), v.url()),
  },
});
