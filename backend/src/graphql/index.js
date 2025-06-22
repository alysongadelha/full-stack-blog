import { querySchema, queryResolver } from './query.js'
import { postSchema, postResolver } from './post.js'
import { useSchema, userResolver } from './user.js'
import { mutationSchema, mutationResolver } from './mutation.js'

export const typeDefs = [querySchema, postSchema, useSchema, mutationSchema]
export const resolvers = [
  queryResolver,
  postResolver,
  userResolver,
  mutationResolver,
]
