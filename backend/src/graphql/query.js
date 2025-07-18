import {
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
} from '../services/posts.js'

export const querySchema = `#graphql
    input PostsOptions {
        sortBy: String
        sortOrder: String
    }
    type Query {
        test: String
        posts(options: PostsOptions): [Post!]!
        postsByAuthor(username: String!, options: PostsOptions): [Post!]!
        postsByTag(tag: String!, options: PostsOptions): [Post!]!
        postById(id: ID!, options: PostsOptions): Post
    }
`

export const queryResolver = {
  Query: {
    test: () => {
      return 'Hello World from GraphQL!'
    },
    posts: async (parent, { options }) => await listAllPosts(options),
    postsByAuthor: async (parent, { username, options }) =>
      await listPostsByAuthor(username, options),
    postsByTag: async (parent, { tag, options }) =>
      await listPostsByTag(tag, options),
    postById: async (parent, { id }) => await getPostById(id),
  },
}
