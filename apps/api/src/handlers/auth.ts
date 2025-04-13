import { Hono } from "hono";
import { configuredProviders, auth } from "../utils/auth";
import { cors } from "hono/cors";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

const handler = new Hono();
handler.use(
  "/**", // or replace with "*" to enable cors for all routes
  cors({
    origin: (origin, _) => {
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return undefined;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

handler.on(["GET"], "/auth-providers", (c) => {
  return c.json(Object.keys(configuredProviders));
});

handler.on(["POST", "GET"], "/**", (c) => {
  return auth.handler(c.req.raw);
});

export default handler;
