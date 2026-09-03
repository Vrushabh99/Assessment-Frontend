import { QuestionTableWrapper, Table, EmptyState } from './styles'
import { Button } from '../ui/Button'
import { Pill } from '../ui/Pill'

const formatLabel = (value) => value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
const getTone = (value) => ({
  draft: 'warning',
  published: 'success',
  easy: 'success',
  medium: 'warning',
  hard: 'info',
  'single-choice': 'info',
  'multiple-choice': 'info',
  'short-answer': 'neutral',
}[value] || 'neutral')

/* eslint-disable react/prop-types */
export function QuestionTable({ questions, onEdit }) {
  if (!questions.length) return <EmptyState>No questions match your filters.</EmptyState>

  return (
    <QuestionTableWrapper>
      <Table>
        <thead><tr><th>ID</th><th>Question</th><th>Type</th><th>Difficulty</th><th>Usage</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{questions.map((question) => (
          <tr key={question.id}>
            <td>QP-{question.qp_number}</td><td>{question.questionText}</td>
            <td><Pill tone={getTone(question.type)}>{formatLabel(question.type)}</Pill></td>
            <td><Pill tone={getTone(question.difficulty)}>{formatLabel(question.difficulty)}</Pill></td>
            <td>{question.usage} assessments</td>
            <td><Pill tone={getTone(question.status)}>{formatLabel(question.status)}</Pill></td>
            <td><Button type="button" variant="secondary" onClick={() => onEdit(question)}>Edit</Button></td>
          </tr>
        ))}</tbody>
      </Table>
    </QuestionTableWrapper>
  )
}
