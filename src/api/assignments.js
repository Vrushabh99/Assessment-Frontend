import { apiRequest } from './client'

export const AssignmentKeys = {
  prefix: ['assignments'],
  all: ({ page = 1, limit = 20, search = '', status = ''}) => ['assignments', { page, limit, search, status }],
  detail: (id) => ['assignments', id],
  'assessment-assignment': (id) => ['assessment-assignment', id],
  'assignment-candidates': (assignmentId, params) => ['assignment-candidates', assignmentId, params],
};

export async function listAssignments({ page = 1, limit = 100, status = '', search } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status) params.set('status', status)
  if (search) params.set('search', search)
  const response = await apiRequest(`/admin/assignments?${params.toString()}`)
  return response.data
}

export async function deleteAssignment(id) {
  const response = await apiRequest(`/admin/assignments/${id}`, { method: 'DELETE' })
  return response.data
}

export async function cancelAssignment(id) {
  const response = await apiRequest(`/admin/assignments/${id}/cancel`, { method: 'POST' })
  return response.data
}

export async function getAssignment(id) {
  const response = await apiRequest(`/admin/assignments/${id}`)
  return response.data
}

export async function getAssignmentByAssessment(assessmentId) {
  const response = await apiRequest(`/admin/assessments/${assessmentId}/assignment`)
  return response.data
}

export async function updateAssignment({ id, ...assignment }) {
  const response = await apiRequest(`/admin/assignments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(assignment),
  })
  return response.data
}

export async function assignAssessment({ assessmentId, ...assignment }) {
  const response = await apiRequest(`/admin/assessments/${assessmentId}/assign`, {
    method: 'POST',
    body: JSON.stringify(assignment),
  })
  return response.data
}

export async function listAssignmentCandidates(assignmentId, { page = 1, limit = 10, search = '', status = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search) params.set('search', search)
  if (status) params.set('status', status)
  const response = await apiRequest(`/admin/assignments/${assignmentId}/candidates?${params.toString()}`)
  return response.data
}
