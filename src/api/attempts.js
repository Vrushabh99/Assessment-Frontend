import { apiRequest } from './client'

export const attemptKeys = {
  all: ({page, limit, status, search}) => ['myAssessments', page, limit, status, search],
}

export async function listMyAssessments({ page = 1, limit = 100, status = ''}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status) params.set('status', status)
  const response = await apiRequest(`/candidate/assessments?${params.toString()}`)
  return response.data
}

export const candidateAssessmentKeys = {
  detail: (assessmentId, assignmentId) => ['candidateAssessment', assessmentId, assignmentId],
  attempt: (assessmentId, assignmentId) => ['attemptState', assessmentId, assignmentId],
}

export async function getCandidateAssessment({ assessmentId, assignmentId }) {
  const response = await apiRequest(`/candidate/assessments/${assessmentId}/assignments/${assignmentId}`)
  return response.data
}

export async function startAndGetAttemptState({ assessmentId, assignmentId }) {
  const response = await apiRequest(`/candidate/assessments/${assessmentId}/assignments/${assignmentId}/start`, {
    method: 'POST',
  })
  return response.data
}

export async function startAttempt({ assessmentId, assignmentId }) {
  const response = await apiRequest(`/candidate/assessments/${assessmentId}/assignments/${assignmentId}/start`, {
    method: 'POST',
  })
  return response.data
}

export async function getAttemptState({ assessmentId, assignmentId }) {
  const response = await apiRequest(`/candidate/assessments/${assessmentId}/assignments/${assignmentId}/attempt`)
  return response.data
}

export async function saveAnswer({ assessmentId, assignmentId, questionId, selectedOptionIds, textAnswer }) {
  const response = await apiRequest(`/candidate/assessments/${assessmentId}/assignments/${assignmentId}/answers`, {
    method: 'PATCH',
    body: JSON.stringify({ questionId, selectedOptionIds, textAnswer }),
  })
  return response.data
}

export async function logViolation({ assessmentId, assignmentId, type }) {
  const response = await apiRequest(`/candidate/assessments/${assessmentId}/assignments/${assignmentId}/violations`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  })
  return response.data
}

export async function submitAttempt({ assessmentId, assignmentId }) {
  const response = await apiRequest(`/candidate/assessments/${assessmentId}/assignments/${assignmentId}/submit`, {
    method: 'POST',
  })
  return response.data
}
