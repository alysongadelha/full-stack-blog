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
describe('creating posts', () => {
  test('with all parameters should succeed', async () => {
    const post = {
      title: 'Hello mongoose!',
      author: new mongoose.Types.ObjectId(),
      contents: 'This post is stored in a MongoDB database using Mongoose.',
      tags: ['mongoose', 'mongodb'],
    }

    const createdPost = await createPost(post)

    expect(createdPost._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundPost = await Post.findById(createdPost._id)

    expect(foundPost).toEqual(expect.objectContaining(post))
    expect(foundPost.createdAt).toBeInstanceOf(Date)
    expect(foundPost.updatedAt).toBeInstanceOf(Date)
  })

  test('without title should fail', async () => {
    const post = {
      author: 'Alyson Gadelha',
      contents: 'Post without title.',
      tags: ['empty'],
    }

    try {
      await createPost(post)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`title` is required')
    }
  })

  test('with minimal parameters should succeed', async () => {
    const post = {
      title: 'Only a title',
      author: new mongoose.Types.ObjectId(),
    }

    const createdPost = await createPost(post)

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
beforeEach(async () => {
  await Post.deleteMany({})
  createdSamplePosts = []
  for (const post of samplePosts) {
    const createdPost = new Post(post)
    createdSamplePosts.push(await createdPost.save())
  }

  postId = createdSamplePosts[0]._id
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
    const posts = await listPostsByAuthor('68164cee46ca3facab04232f')
    expect(posts.length).toBe(3)
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
    await updatePost(postId, {
      author: '551137c2f9e1fac808a5f572',
    })

    const updatedPost = await Post.findById(postId)

    expect(updatedPost.author.toString()).toEqual('551137c2f9e1fac808a5f572')
  })

  test('should not update other properties', async () => {
    await updatePost(postId, {
      author: new mongoose.Types.ObjectId(),
    })

    const updatedPost = await Post.findById(postId)

    expect(updatedPost.title).toEqual('Learning Redux')
  })

  test('should update the updatedAt timestamp', async () => {
    await updatePost(postId, {
      author: new mongoose.Types.ObjectId(),
    })

    const updatedPost = await Post.findById(postId)

    expect(updatedPost.updatedAt.getTime()).toBeGreaterThan(
      createdSamplePosts[0].updatedAt.getTime(),
    )
  })

  test('should fail if the id does not exist', async () => {
    const post = await updatePost('0'.repeat(24), {
      author: new mongoose.Types.ObjectId(),
    })

    expect(post).toEqual(null)
  })
})

describe('deleting posts', () => {
  test('should remove the post from the database', async () => {
    const result = await deletePost(postId)

    expect(result.deletedCount).toEqual(1)

    const deletedPost = await Post.findById(postId)

    expect(deletedPost).toEqual(null)
  })

  test('should fail if the id does not exist', async () => {
    const result = await deletePost('0'.repeat(24))

    expect(result.deletedCount).toEqual(0)
  })
})
