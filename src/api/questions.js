import { apiRequest } from './client'

export const QuestionKeys = {
  prefix: ['questions'],
  all: ({page = 1, limit = 20, search = '', status, type }) => ['questions', {page, limit, search, status, type }],
  detail: (id) => ['questions', id],
}

export async function listQuestions({ page = 1, limit = 20, search = '', type, status } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (search) params.set('search', search)
  if (type) params.set('type', type)
  if (status) params.set('status', status)
  const response = await apiRequest(`/admin/questions?${params.toString()}`)
  const data = response.data
  if (Array.isArray(data)) return { items: data, total: data.length, totalPages: 1 }
  return {
    items: data.questions || data.items || [],
    total: data.total || data.pagination?.total || 0,
    totalPages: data.totalPages || data.pagination?.totalPages || 1,
  }
}

export async function getQuestion(id) {
  const response = await apiRequest(`/admin/questions/${id}`)
  return response.data
}

export async function createQuestion(question) {
  const response = await apiRequest('/admin/questions', {
    method: 'POST',
    body: JSON.stringify(question),
  })
  return response.data
}

export async function updateQuestion({ id, ...question }) {
  const response = await apiRequest(`/admin/questions/${id}`, {
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
