import { apiRequest } from './client'

export const submissionKeys = {
  detail: (submissionId) => ['submissions', submissionId],
}

export async function getSubmission(submissionId) {
  const response = await apiRequest(`/admin/submissions/${submissionId}`)
  return response.data
}

export async function updateSubmissionGrade({ submissionId, questionId, score, feedback }) {
  const response = await apiRequest(`/admin/submissions/${submissionId}/grade`, {
    method: 'PATCH',
    body: JSON.stringify({ questionId, score, feedback }),
  })
  return response.data
}
