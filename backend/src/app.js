import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@as-integrations/express5'
import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { typeDefs, resolvers } from './graphql/index.js'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
})

apolloServer
  .start()
  .then(() => app.use('/graphql', expressMiddleware(apolloServer)))

postsRoutes(app)
userRoutes(app)
eventRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from express')
})

export { app }
