import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { CommonLoader } from '../ui/CommonLoader'

/* eslint-disable react/prop-types */
export function ProtectedRoute({ children, allowedRole }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <CommonLoader label="Loading session..." />
  return user?.role === allowedRole ? children : <Navigate to="/login" replace />
}
