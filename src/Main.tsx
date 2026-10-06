import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { GlobalStyle } from './styles/GlobalStyle'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/theme'

import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'

// Extend Window interface to include custom property
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__?: QueryClient;
  }
}

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
    onSuccess: (_data, query) => {
      console.log(`Query ${query.queryKey} — hit: ${query.state.dataUpdateCount === 1 ? false : true}`)
    },
  }),
})

window.__TANSTACK_QUERY_CLIENT__ = queryClient;

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found in HTML')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
