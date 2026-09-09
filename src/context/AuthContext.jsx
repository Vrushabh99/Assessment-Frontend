/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiRequest } from '../api/client'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const authChannelRef = useRef(null);
  if (!authChannelRef.current) {
    authChannelRef.current = new BroadcastChannel('auth-channel')
  }
  
  
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
  })
  
  useEffect(() => {
    authChannelRef.current.onmessage = (e) => {
      if (e.data.type === 'logout') {
        queryClient.clear();
        sessionQuery.refetch();
      }
    }
  }, [authChannelRef])

  const loginMutation = useMutation({
    mutationFn: (credentials) => apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
    onSuccess: (payload) => {
      queryClient.setQueryData(['auth', 'me'], payload.data.user)
    },
  })

  const googleLoginMutation = useMutation({
    mutationFn: (data) => apiRequest('/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    onSuccess: (payload) => {
      queryClient.setQueryData(['auth', 'me'], payload.data.user)
    },
  })
  
  const logoutMutation = useMutation({
    mutationFn: () => apiRequest('/auth/logout', { method: 'POST' }),
    onSuccess: () => {
      authChannelRef.current.postMessage({ type: 'logout'});
      queryClient.clear();
    },
  })

  const value = useMemo(() => ({
    user: sessionQuery.data ?? null,
    isLoading: sessionQuery.isLoading,
    login: async (credentials) => {
      const payload = await loginMutation.mutateAsync(credentials)
      return payload.data.user
    },
    googleLogin: async (data) => {
      const payload = await googleLoginMutation.mutateAsync(data)
      return payload.data.user
    },
    logout: () => logoutMutation.mutateAsync(),
  }), [loginMutation, googleLoginMutation, logoutMutation, sessionQuery.data, sessionQuery.isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
