import { querySchema, queryResolver } from './query.js'
import { postResolver, postSchema } from './post.js'
import { useSchema, userResolver } from './user.js'

export const typeDefs = [querySchema, postSchema, useSchema]
export const resolvers = [queryResolver, postResolver, userResolver]
