import { apiRequest } from './client'

export const candidateKeys = {
  all: ['candidates'],
  detail: (id) => ['candidates', id],
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

export const submissionKeys = {
  detail: (assignmentId, candidateId) => ['submissions', assignmentId, candidateId],
}

export async function getSubmission(assignmentId, candidateId) {
  const response = await apiRequest(`/candidate/assignments/${assignmentId}/candidate/${candidateId}/attempt`)
  return response.data
}