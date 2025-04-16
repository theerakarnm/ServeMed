import { db, schema } from "@workspace/db/src";
import { betterAuth } from "better-auth"
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:7300",
  secret: process.env.BETTER_AUTH_SECRET || undefined,
  // socialProviders: configuredProviders,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  trustedOrigins: process.env.ALLOWED_ORIGINS?.split(",") || [],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  advanced: {
    crossSubDomainCookies: {
      enabled: true
    }
  }
});
