import { getPostById } from '../services/posts.js'
import { trackEvent } from '../services/events.js'

export const eventRoutes = (app) => {
  app.post('/api/v1/events', async (req, res) => {
    try {
      const { postId, session, action } = req.body
      const post = await getPostById(postId)

      if (post === null) return res.status(400).end()

      const event = await trackEvent({ postId, session, action })

      return res.json({ session: event.session })
    } catch (error) {
      console.error('error tracking action', error)
      return res.status(500).end()
    }
  })
}
