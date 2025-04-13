import { Hono } from 'hono'

import * as handlers from './handlers'

const app = new Hono().basePath('/api')

app.route('/auth/**', handlers.auth)

export default {
  port: process.env.PORT || 7300,
  fetch: app.fetch,
}
