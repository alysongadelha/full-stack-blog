import { describe, expect, test } from '@jest/globals'
import mongoose from 'mongoose'
import { User } from '../db/models/user'
import { createUser } from '../services/users'

describe('creating users', () => {
  test('should be succeed', async () => {
    const user = {
      username: 'Alyson Gadelha',
      password: 'password1',
    }

    const createdUser = await createUser(user)
    expect(createdUser._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundUser = await User.findById(createdUser._id)

    expect(foundUser.username).toBe(createdUser.username)
    expect(foundUser.password).toBe(createdUser.password)
  })
})
