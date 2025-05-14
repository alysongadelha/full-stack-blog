import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'

export const createPost = async (userId, { title, contents, tags }) => {
  const post = new Post({
    title,
    author: userId,
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

export const listPostsByAuthor = async (authorUsername, options) => {
  const user = await User.findOne({ username: authorUsername })

  console.log('user', await User.find())

  if (!user) return []

  return await listPosts({ author: user._id }, options)
}

export const listPostsByTag = async (tags, options) =>
  await listPosts({ tags }, options)

export const getPostById = async (postId) => await Post.findById(postId)

export const updatePost = async (userId, postId, { title, contents, tags }) =>
  await Post.findOneAndUpdate(
    { _id: postId, author: userId },
    { $set: { title, contents, tags } },
    { new: true },
  )

export const deletePost = async (userId, postId) =>
  await Post.deleteOne({ _id: postId, author: userId })
