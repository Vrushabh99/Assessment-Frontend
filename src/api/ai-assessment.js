import { apiRequest } from './client'

export async function generateAIAssessment(body) {
  const response = await apiRequest('/admin/ai/generate-questions', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return response.data
}
export async function createAIAssessment(body) {
  const response = await apiRequest('/admin/ai/create-assessment', {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return response.data
}