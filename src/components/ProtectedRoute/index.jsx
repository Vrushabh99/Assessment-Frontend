import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/* eslint-disable react/prop-types */
export function ProtectedRoute({ children, allowedRole }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div>Loading session...</div>
  return user?.role === allowedRole ? children : <Navigate to="/login" replace />
}
