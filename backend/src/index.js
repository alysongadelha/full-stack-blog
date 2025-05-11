import { app } from './app.js'
import { initDatabase } from './db/init.js'
import dotenv from 'dotenv'

dotenv.config()

try {
  await initDatabase()
  const PORT = process.env.PORT || 8080
  app.listen(PORT, () => {
    console.info(`express server running on http://localhost:${PORT}`)
  })
} catch (error) {
  console.error('error connecting to database', error)
  console.log('Verify the database connection')
}
