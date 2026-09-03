import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { ROLES } from '../constants/roles'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AssessmentManagementPage } from '../pages/admin/AssessmentManagementPage'
import { QuestionsDashboardPage } from '../pages/admin/QuestionsDashboardPage'
import { CandidateDashboardPage } from '../pages/candidate/CandidateDashboardPage'
import { AssessmentAttemptPage } from '../pages/candidate/AssessmentAttemptPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { AuthProvider } from '../context/AuthContext'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><AdminDashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/assessments"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><AssessmentManagementPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/questions"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><QuestionsDashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/candidate"
          element={<ProtectedRoute allowedRole={ROLES.CANDIDATE}><CandidateDashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/candidate/assessments/:assessmentId"
          element={<ProtectedRoute allowedRole={ROLES.CANDIDATE}><AssessmentAttemptPage /></ProtectedRoute>}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
