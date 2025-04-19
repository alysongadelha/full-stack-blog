import { Post } from '../db/models/post.js'

export const createPost = async ({ title, author, contents, tags }) => {
  const post = new Post({
    title,
    author,
    contents,
    tags,
  })

  return await post.save()
}

export const listPosts = async (
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) => await Post.find(query).sort({ [sortBy]: sortOrder })

export const listAllPosts = async (options) => await listPosts({}, options)

export const listPostsByAuthor = async (author, options) =>
  await listPosts({ author }, options)

export const listPostsByTag = async (tags, options) =>
  await listPosts({ tags }, options)

export const getPostById = async (postId) => await Post.findById(postId)

export const updatePost = async (postId, { title, author, contents, tags }) =>
  await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author, contents, tags } },
    { new: true },
  )

export const deletePost = async (postId) =>
  await Post.deleteOne({ _id: postId })
