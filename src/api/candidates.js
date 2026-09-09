import { apiRequest } from './client'

export const CandidateKeys = {
  prefix: ['candidates'],
  all:  ({search = '', page = 1, limit = 20 }) => ['candidates', { search, page, limit }],
  detail: (id) => ['candidate', id],
  candidateAttempts: ({ candidateId, page, limit, status }) => ['candidate-attempts', candidateId, { page, limit, status }],
}

export const SubmissionKeys = {
  prefix: ['submission'],
  detail: (assignmentId) => ['submission', assignmentId],
}

export async function listCandidates({ page = 1, limit = 50, search = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search.trim()) params.set('search', search.trim())
  const response = await apiRequest(`/admin/candidates?${params.toString()}`)
  return response.data
}

export async function getCandidate(id) {
  const response = await apiRequest(`/admin/candidates/${id}`)
  return response.data
}

export async function getCandidateAttempts(candidateId, { page = 1, limit = 50, status = '' }) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status) {
    params.set('status', status);
  }
  const response = await apiRequest(`/admin/candidates/${candidateId}/attempt?${params.toString()}`)
  return response.data
}

export async function createCandidate(candidate) {
  const response = await apiRequest('/admin/candidates', {
    method: 'POST',
    body: JSON.stringify(candidate),
  })
  return response.data
}

export async function updateCandidate({ id, ...candidate }) {
  const response = await apiRequest(`/admin/candidates/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(candidate),
  })
  return response.data
}

export async function deleteCandidate(id) {
  const response = await apiRequest(`/admin/candidates/${id}`, { method: 'DELETE' })
  return response.data
}

export async function getSubmission(assignmentId, candidateId) {
  const response = await apiRequest(`/candidate/assignments/${assignmentId}/candidate/${candidateId}/attempt`)
  return response.data
}

