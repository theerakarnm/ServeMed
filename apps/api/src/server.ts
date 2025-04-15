import { Hono } from 'hono'
import * as handlers from './handlers'
import { cors } from 'hono/cors';

const app = new Hono().basePath('/api')

app.use('/*', cors({
  origin: (origin, _) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return undefined;
  },
  maxAge: 600,
  credentials: true
}))

app.route('/auth', handlers.auth)

export default {
  port: process.env.PORT || 7300,
  fetch: app.fetch,
}
