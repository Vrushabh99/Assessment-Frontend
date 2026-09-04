import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { ROLES } from '../constants/roles'
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage'
import { AssessmentManagementPage } from '../pages/admin/AssessmentManagementPage'
import { AssessmentEditorPage } from '../pages/admin/AssessmentEditorPage'
import { AssessmentDetailsPage } from '../pages/admin/AssessmentDetailsPage'
import { AssignAssessmentPage } from '../pages/admin/AssignAssessmentPage'
import { AssignmentManagementPage } from '../pages/admin/AssignmentManagementPage'
import { AssignmentEditPage } from '../pages/admin/AssignmentEditPage'
import { QuestionsDashboardPage } from '../pages/admin/QuestionsDashboardPage'
import { QuestionEditorPage } from '../pages/admin/QuestionEditorPage'
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
          path="/admin/assessments/new"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><AssessmentEditorPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/assessments/:assessmentId/edit"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><AssessmentEditorPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/assessments/:assessmentId"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><AssessmentDetailsPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/assessments/:assessmentId/assign"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><AssignAssessmentPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/assignments"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><AssignmentManagementPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/assignments/:assignmentId/edit"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><AssignmentEditPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/questions"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><QuestionsDashboardPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/questions/new"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><QuestionEditorPage /></ProtectedRoute>}
        />
        <Route
          path="/admin/questions/:questionId/edit"
          element={<ProtectedRoute allowedRole={ROLES.ADMIN}><QuestionEditorPage /></ProtectedRoute>}
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
