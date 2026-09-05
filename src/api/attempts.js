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
  detail: ( assignmentId) => ['candidateAssessment',  assignmentId],
  attempt: ( assignmentId) => ['attemptState',  assignmentId],
}

export async function getCandidateAssessment({ assignmentId }) {
  const response = await apiRequest(`/candidate/assignments/${assignmentId}`)
  return response.data
}

export async function startAndGetAttemptState({  assignmentId }) {
  const response = await apiRequest(`/candidate/assignments/${assignmentId}/start`, {
    method: 'POST',
  })
  return response.data
}

export async function startAttempt({  assignmentId }) {
  const response = await apiRequest(`/candidate/assignments/${assignmentId}/start`, {
    method: 'POST',
  })
  return response.data
}

export async function getAttemptState({  assignmentId }) {
  const response = await apiRequest(`/candidate/assignments/${assignmentId}/attempt`)
  return response.data
}

export async function saveAnswer({  assignmentId, questionId, selectedOptionIds, textAnswer }) {
  const response = await apiRequest(`/candidate/assignments/${assignmentId}/answers`, {
    method: 'PATCH',
    body: JSON.stringify({ questionId, selectedOptionIds, textAnswer }),
  })
  return response.data
}

export async function logViolation({  assignmentId, type }) {
  const response = await apiRequest(`/candidate/assignments/${assignmentId}/violations`, {
    method: 'POST',
    body: JSON.stringify({ type }),
  })
  return response.data
}

export async function submitAttempt({  assignmentId }) {
  const response = await apiRequest(`/candidate/assignments/${assignmentId}/submit`, {
    method: 'POST',
  })
  return response.data
}
