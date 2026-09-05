/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const sessionQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      try {
        const payload = await apiRequest('/auth/me')
        return payload.data
      } catch (error) {
        if (error.status === 401) return null
        throw error
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    onSuccess: (payload) => {
      queryClient.setQueryData(['auth', 'me'], payload.data.user)
    },
  })
  
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('/auth/logout', { method: 'POST' }),
    onSuccess: () => { queryClient.clear() },
  })

  const value = useMemo(() => ({
    user: sessionQuery.data ?? null,
    isLoading: sessionQuery.isLoading,
    login: async (credentials) => {
      const payload = await loginMutation.mutateAsync(credentials)
      return payload.data.user
    },
    logout: () => logoutMutation.mutateAsync(),
  }), [loginMutation, logoutMutation, sessionQuery.data, sessionQuery.isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
