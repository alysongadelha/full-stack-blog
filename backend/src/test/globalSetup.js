import { MongoMemoryServer } from 'mongodb-memory-server'

const globalSetup = async () => {
  const instance = await MongoMemoryServer.create({
    binary: {
      version: '6.0.4',
    },
  })

  global._MONGOINSTANCE = instance
  process.env.DATABASE_URL = instance.getUri()
}

export default globalSetup
