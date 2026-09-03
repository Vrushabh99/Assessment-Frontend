import { apiRequest } from './client'

export const questionKeys = {
  all: ['questions'],
  detail: (id) => ['questions', id],
}

export async function listQuestions() {
  const response = await apiRequest('/questions')
  return response.data
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
