import { apiRequest } from './client'

export const questionKeys = {
  all: ['questions'],
  detail: (id) => ['questions', id],
}

export async function listQuestions({ page = 1, limit = 25, search = '' } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search) params.set('search', search)
  const response = await apiRequest(`/questions?${params.toString()}`)
  const data = response.data
  if (Array.isArray(data)) return { items: data, total: data.length, totalPages: 1 }
  return {
    items: data.questions || data.items || [],
    total: data.total || data.pagination?.total || 0,
    totalPages: data.totalPages || data.pagination?.totalPages || 1,
  }
}

export async function getQuestion(id) {
  const response = await apiRequest(`/questions/${id}`)
  return response.data
}

export async function createQuestion(question) {
  const response = await apiRequest('/questions', {
    method: 'POST',
    body: JSON.stringify(question),
  })
  return response.data
}

export async function updateQuestion({ id, ...question }) {
  const response = await apiRequest(`/questions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(question),
  })
  return response.data
}

export function normalizeQuestion(question) {
  return {
    ...question,
    id: question.id || question._id,
    questionText: question.questionText || question.title || '',
    usage: question.usage || 0,
  }
}
