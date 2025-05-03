import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema({
  username: { type: String, require: true, unique: true },
  password: { type: String, required: true },
})

export const User = mongoose.model('user', userSchema)
