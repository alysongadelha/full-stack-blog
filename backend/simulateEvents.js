import dotenv from 'dotenv'
dotenv.config()

import { initDatabase } from './src/db/init.js'
import { Post } from './src/db/models/post.js'
import { User } from './src/db/models/user.js'
import { Event } from './src/db/models/event.js'
import { createUser } from './src/services/users.js'
import { createPost } from './src/services/posts.js'
import { trackEvent } from './src/services/events.js'

const simulationStart = Date.now() - 1000 * 60 * 60 * 24 * 30
const simulationEnd = Date.now()
const simulatedUsers = 5
const simulatedPosts = 10
const simulatedViews = 10000

const simulateEvents = async () => {
  const connection = await initDatabase()

  await User.deleteMany({})
  const createdUsers = await Promise.all(
    Array(simulatedUsers)
      .fill(null)
      .map(
        async (_, index) =>
          await createUser({
            username: `user-${index}`,
            password: `password-${index}`,
          }),
      ),
  )
  console.log(`created ${createdUsers.length} users`)

  await Post.deleteMany({})
  const createdPosts = await Promise.all(
    Array(simulatedPosts)
      .fill()
      .map(async (_, index) => {
        const randomUser =
          createdUsers[Math.floor(Math.random() * simulatedUsers)]

        return await createPost(randomUser._id, {
          title: `Test Post ${index}`,
          contents: `This is a test post ${index}`,
        })
      }),
  )
  console.log(`created ${createdPosts.length} posts`)

  await Event.deleteMany({})
  const createdViews = await Promise.all(
    Array(simulatedViews)
      .fill()
      .map(async () => {
        const randomPost =
          createdPosts[Math.floor(Math.random() * simulatedPosts)]
        const sessionStart =
          simulationStart + Math.random() * (simulationEnd - simulationStart)
        const sessionEnd =
          sessionStart + 1000 * Math.floor(Math.random() * 60 * 5)

        const event = await trackEvent({
          postId: randomPost._id,
          action: 'startView',
          date: new Date(sessionStart),
        })

        await trackEvent({
          postId: randomPost._id,
          session: event.session,
          action: 'endView',
          date: new Date(sessionEnd),
        })
      }),
  )
  console.log(`successfully simulated ${createdViews.length} views`)

  await connection.disconnect()
}

simulateEvents()
