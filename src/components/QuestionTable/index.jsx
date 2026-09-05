import { QuestionGridWrapper, QuestionCard, QuestionContent, QuestionId, QuestionText, QuestionMetadata, CardActions, EmptyState } from './styles'
import { Menu } from '../ui/Menu'
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
export function QuestionTable({ questions, onEdit, onDelete }) {
  if (!questions.length) return <EmptyState>No questions match your filters.</EmptyState>

  const getMenuItems = (question) => [
    { id: 'edit', label: 'Edit', onClick: () => onEdit(question) },
    onDelete && { isDivider: true },
    onDelete && { id: 'delete', label: 'Delete', danger: true, onClick: () => onDelete(question) },
  ].filter(Boolean)

  return (
    <QuestionGridWrapper>
      {questions.map((question) => (
        <QuestionCard key={question.id}>
          <QuestionContent>
              <QuestionId>QP-{question.qp_number}</QuestionId>
              <QuestionText>{question.questionText}</QuestionText>
            <QuestionMetadata>
              <Pill tone={getTone(question.type)}>{formatLabel(question.type)}</Pill>
              <Pill tone={getTone(question.difficulty)}>{formatLabel(question.difficulty)}</Pill>
              <Pill tone={getTone(question.status)}>{formatLabel(question.status)}</Pill>
              <Pill tone="info">Points: {question.points}</Pill>
            </QuestionMetadata>
          </QuestionContent>
          <CardActions>
            <Menu trigger="⋮" items={getMenuItems(question)} />
          </CardActions>
        </QuestionCard>
      ))}
    </QuestionGridWrapper>
  )
}
