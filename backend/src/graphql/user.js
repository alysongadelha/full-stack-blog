import { listPostsByAuthor } from '../services/posts.js'

export const useSchema = `#graphql
    type User {
        username: String!
        posts: [Post!]!
    }
`

export const userResolver = {
  User: {
    posts: async (user) => await listPostsByAuthor(user.username),
  },
}
