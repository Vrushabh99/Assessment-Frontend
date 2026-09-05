import { apiRequest } from './client'

export const submissionKeys = {
  detail: (assignmentId, candidateId) => ['submissions', assignmentId, candidateId],
}

export async function getSubmission(assignmentId, candidateId) {
  const response = await apiRequest(`/admin/assignments/${assignmentId}/candidates/${candidateId}/attempt`)
  return response.data
}

export async function updateSubmissionGrade({ attemptId, questionId, score }) {
  const response = await apiRequest(`/admin/attempts/${attemptId}/score`, {
    method: 'PATCH',
    body: JSON.stringify({attemptId, answers: [{ questionId, score }] }),
  })
  return response.data
}
