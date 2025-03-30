import { Hono } from 'hono'
import { db } from '@workspace/db'
import { schema } from '@workspace/db'
import { user as userType } from '@workspace/types'

const app = new Hono()

app.post('/user', async (c) => {
  const body = userType.createUserSchema.parse(await c.req.json())
  const [user] = await db.insert(schema.users).values(body).returning()
  return c.json(user)
})

app.get('/', (c) => c.text(JSON.stringify({ hello: 'world', userType })))

export default {
  port: 3000,
  fetch: app.fetch,
} 