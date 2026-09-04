import { apiRequest } from './client'

export const assessmentKeys = {
  all: ['assessments'],
  detail: (id) => ['assessments', id],
}

export async function listAssessments({ page = 1, limit = 20, search = '', status = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search) params.set('search', search)
  if (status) params.set('status', status)
  const response = await apiRequest(`/admin/assessments?${params.toString()}`)
  return response.data
}

export async function createAssessment(assessment) {
  const response = await apiRequest('/admin/assessments', {
    method: 'POST',
    body: JSON.stringify(assessment),
  })
  return response.data
}

export async function getAssessment(id) {
  const response = await apiRequest(`/admin/assessments/${id}`)
  return response.data
}

export async function updateAssessment({ id, ...assessment }) {
  const response = await apiRequest(`/admin/assessments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(assessment),
  })
  return response.data
}

export async function deleteAssessment(id) {
  const response = await apiRequest(`/admin/assessments/${id}`, { method: 'DELETE' })
  return response.data
}
