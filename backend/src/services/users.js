import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../db/models/user.js'

export const createUser = async ({ username, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, password: hashedPassword })

  return await user.save()
}

export const loginUser = async ({ username, password }) => {
  const user = await User.findOne({ username })

  if (!user) {
    throw new Error('Invalid username!')
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) {
    throw new Error('Invalid password!')
  }

  const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })

  return token
}

export const getUserInfoById = async (userId) => {
  try {
    const user = await User.findById(userId)

    if (user) return { username: user.username }
  } catch (error) {
    console.error(`A unexpected error happened: `, error)

    return { username: userId }
  }
}
