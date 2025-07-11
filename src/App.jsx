import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PropTypes from 'prop-types'

// We need to import Apollo from index.js due to a known issue
import { ApolloProvider } from '@apollo/client/react/index.js'
import { ApolloClient, InMemoryCache } from '@apollo/client/core/index.js'

import './App.css'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { HelmetProvider } from 'react-helmet-async'

const queryClient = new QueryClient()
const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL,
  cache: new InMemoryCache(),
})

export const App = ({ children }) => {
  return (
    <HelmetProvider>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>{children}</AuthContextProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </HelmetProvider>
  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
}
