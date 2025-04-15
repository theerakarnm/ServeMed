import { Hono } from "hono";
import { configuredProviders, auth } from "../utils/auth";
import { cors } from "hono/cors";

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

const handler = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>();

handler.use(
  "/*", // or replace with "*" to enable cors for all routes
  cors({
    origin: (origin, _) => {
      if (allowedOrigins.includes(origin)) {
        return origin;
      }
      return undefined;
    },
    allowHeaders: [
      "Content-Type",
      "Authorization",
    ],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,

  }),
);

handler.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

// handler.on(["GET"], "/auth-providers", (c) => {
//   return c.json(Object.keys(configuredProviders));
// });

handler.on(["POST", "GET"], "/*", (c) => {
  return auth.handler(c.req.raw);
});

// handler.get("/session", async (c) => {
//   const session = c.get("session")
//   const user = c.get("user")

//   if (!user) return c.body(null, 401);

//   return c.json({
//     session,
//     user
//   });
// });

export default handler;
