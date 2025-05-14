import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Blog } from './pages/Blog.jsx'
import { Signup } from './pages/Signup.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { Login } from './pages/Login.jsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Blog />,
  },
  {
    path: 'signup',
    element: <Signup />,
  },
  {
    path: 'login',
    element: <Login />,
  },
])

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
