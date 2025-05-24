import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const createDevServer = async () => {
  const app = express()

  const vite = await (
    await import('vite')
  ).createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  })

  app.use(vite.middlewares)
  app.use((req, res, next) => {
    if (req.path.startsWith('/.well-known')) {
      return res.status(404).send('Not Found')
    }
    next()
  })
  app.use(async (req, res, next) => {
    try {
      const templateHtml = fs.readFileSync(
        path.resolve(__dirname, 'index.html'),
        'utf-8',
      )
      const template = await vite.transformIndexHtml(
        req.originalUrl,
        templateHtml,
      )

      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')
      const appHtml = await render(req)
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (error) {
      vite.ssrFixStacktrace(error)
      next(error)
    }
  })

  return app
}

const createProdServer = async () => {
  const app = express()

  app.use((await import('compression')).default())
  app.use(
    (await import('serve-static')).default(
      path.resolve(__dirname, 'dist/client'),
      {
        index: false,
      },
    ),
  )
  app.use(async (req, res, next) => {
    try {
      let template = fs.readFileSync(
        path.resolve(__dirname, 'dist/client/index.html'),
        'utf-8',
      )
      const render = (await import('./dist/server/entry-server.js')).render
      const appHtml = await render(req)
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (error) {
      console.error(error)
      next(error)
    }
  })

  return app
}

if (process.env.NODE_ENV === 'production') {
  const app = await createProdServer()
  app.listen(process.env.PORT, () => {
    console.log(
      `ssr production server running on http://localhost:${process.env.PORT}`,
    )
  })
} else {
  const app = await createDevServer()
  app.listen(process.env.PORT, () => {
    console.log(
      `srr dev server running on http://localhost:${process.env.PORT}`,
    )
  })
}
