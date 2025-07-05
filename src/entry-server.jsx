import { renderToString } from 'react-dom/server'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server'
import { App } from './App.jsx'
import { routes } from './routes.jsx'
import { createFetchRequest } from './request.js'

const handler = createStaticHandler(routes, {
  future: {
    v7_startTransition: true,
  },
})

export const render = async (req) => {
  const fetchRequest = createFetchRequest(req)
  const context = await handler.query(fetchRequest)
  const router = createStaticRouter(handler.dataRoutes, context)

  return renderToString(
    <App>
      <StaticRouterProvider router={router} context={context} />
    </App>,
  )
}
