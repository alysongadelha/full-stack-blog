import dotenv from 'dotenv'
dotenv.config()

import globalSetup from './test/globalSetup.js'
import { app } from './app.js'
import { initDatabase } from './db/init.js'

const runTestingServer = async () => {
  await globalSetup()
  await initDatabase()
  const PORT = process.env.PORT || 3004
  app.listen(PORT)
  console.info(`TESTING express server running on http://localhost:${PORT}`)
}

runTestingServer()
