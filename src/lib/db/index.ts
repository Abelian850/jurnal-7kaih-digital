import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type DB = ReturnType<typeof getDB>;

export function getDB(d1: D1Database) {
  return drizzle(d1, { schema });
}

// For use in Next.js Server Actions / Route Handlers
// Pass the D1 binding from the Cloudflare environment
declare global {
  // This is populated by Cloudflare Pages runtime
  interface CloudflareEnv {
    DB: D1Database;
    AUTH_SECRET: string;
    GOOGLE_APPS_SCRIPT_URL: string;
    GOOGLE_APPS_SCRIPT_TOKEN: string;
  }
}
