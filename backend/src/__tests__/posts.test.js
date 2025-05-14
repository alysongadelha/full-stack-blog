import { describe, expect, test, beforeEach } from '@jest/globals'
import {
  createPost,
  deletePost,
  getPostById,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  updatePost,
} from '../services/posts'
import mongoose from 'mongoose'
import { Post } from '../db/models/post'
import { User } from '../db/models/user'
describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello mongoose!',
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }

    const createdPost = await createPost(new mongoose.Types.ObjectId(), post)

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)

    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const userId = new mongoose.Types.ObjectId()
    const post = {
      contents: 'Post without title.',
      tags: ['empty'],
    }

    try {
      await createPost(userId, post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const userId = new mongoose.Types.ObjectId()
    const post = {
      title: 'Only a title',
    }

    const createdPost = await createPost(userId, post)

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })
})

const samplePosts = [
  {
    title: 'Learning Redux',
    author: '68164cee46ca3facab04232f',
    tags: ['redux'],
  },
  {
    title: 'Learn React Hooks',
    author: '68164cee46ca3facab04232f',
    tags: ['react'],
  },
  {
    title: 'Full-Stack React Projects',
    author: '68164cee46ca3facab04232f',
    tags: ['react', 'nodejs'],
  },
  { title: 'Guide to Typescript', author: '551137c2f9e1fac808a5f572' },
]

let createdSamplePosts = []
let postId
let userId
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }

  postId = createdSamplePosts[0]._id
  userId = createdSamplePosts[0].author
})

describe('listing posts', () => {
  test('should return all posts', async () => {
    const posts = await listAllPosts()
    expect(posts.length).toEqual(createdSamplePosts.length)
  })

  test('should return posts sorted by creation date descending by default', async () => {
    const posts = await listAllPosts()
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => b.createdAt - a.createdAt,
    )
    expect(posts.map((post) => post.createdAt)).toEqual(
      sortedSamplePosts.map((post) => post.createdAt),
    )
  })

  test('should take into account provided sorting options', async () => {
    const posts = await listAllPosts({
      sortBy: 'updatedAt',
      sortOrder: 'ascending',
    })
    const sortedSamplePosts = createdSamplePosts.sort(
      (a, b) => a.updatedAt - b.updatedAt,
    )

    expect(posts.map((post) => post.updatedAt)).toEqual(
      sortedSamplePosts.map((post) => post.updatedAt),
    )
  })

  test('should be able to filter posts by author', async () => {
    const createUser = new User({ username: 'Admin', password: 'admin' })
    const createdUser = await createUser.save()

    const lastPost = new Post({
      title: 'Jest',
      author: createdUser._id,
      tag: ['test', 'pain'],
    })
    createdSamplePosts.push(await lastPost.save())

    const posts = await listPostsByAuthor('Admin')
    expect(posts.length).toBe(1)
  })

  test('should be able to filter posts by tag', async () => {
    const posts = await listPostsByTag('nodejs')
    expect(posts.length).toBe(1)
  })
})

describe('getting a post', () => {
  test('should return the full post', async () => {
    const post = await getPostById(createdSamplePosts[0]._id)
    expect(post.toObject()).toEqual(createdSamplePosts[0].toObject())
  })

  test('should fail if the id does not exist', async () => {
    const post = await getPostById('0'.repeat(24))
    expect(post).toEqual(null)
  })
})

describe('updating posts', () => {
  test('should update the specified property', async () => {
    await updatePost(userId, postId, {
      tags: ['React', 'news'],
    })

    const updatedPost = await Post.findById(postId)

    expect(updatedPost.tags).toEqual(['React', 'news'])
  })

  test('should not update other properties', async () => {
    await updatePost(userId, postId, {
      tags: ['React', 'news'],
    })

    const updatedPost = await Post.findById(postId)

    expect(updatedPost.title).toEqual('Learning Redux')
  })

  test('should update the updatedAt timestamp', async () => {
    await updatePost(userId, postId, {})

    const updatedPost = await Post.findById(postId)

    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const post = await updatePost(userId, '0'.repeat(24), {})

    expect(post).toEqual(null)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(userId, postId)

    expect(result.deletedCount).toEqual(1)

    const deletedPost = await Post.findById(postId)

    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deletePost(userId, '0'.repeat(24))

    expect(result.deletedCount).toEqual(0)
  })
})
