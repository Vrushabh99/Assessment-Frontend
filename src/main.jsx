import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GlobalStyle } from './styles/GlobalStyle'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'

import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
  queryCache: new QueryCache({
    onSuccess: (data, query) => {
      console.log(`Query ${query.queryKey} — hit: ${query.state.dataUpdateCount === 1 ? false : true}`)
    },
  }),
})

window.__TANSTACK_QUERY_CLIENT__ = queryClient;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
