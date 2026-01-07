import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.use('*', clerkMiddleware());
app.use('/api/*', async (c, next) => {
  const auth = getAuth(c);
  if (!auth?.isAuthenticated) return c.status(401);
  
  await next();
});

app.get('/', (c) => c.text('Hello Hono!'))
app.get('/api', (c) => {
  const auth = getAuth(c)

  if (!auth?.userId) {
    return c.json({
      message: 'You are not logged in.',
    })
  }

  return c.json({
    message: 'You are logged in!',
    userId: auth.userId,
  })
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
