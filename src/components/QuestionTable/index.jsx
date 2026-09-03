import { QuestionTableWrapper, Table, Badge, EmptyState } from './styles'

/* eslint-disable react/prop-types */
export function QuestionTable({ questions }) {
  if (!questions.length) return <EmptyState>No questions match your filters.</EmptyState>

  return (
    <QuestionTableWrapper>
      <Table>
        <thead><tr><th>ID</th><th>Question</th><th>Type</th><th>Difficulty</th><th>Usage</th><th>Status</th></tr></thead>
        <tbody>{questions.map((question) => (
          <tr key={question.id}>
            <td>{question.id}</td><td>{question.title}</td><td>{question.type}</td>
            <td>{question.difficulty}</td><td>{question.usage} assessments</td>
            <td><Badge $status={question.status}>{question.status}</Badge></td>
          </tr>
        ))}</tbody>
      </Table>
    </QuestionTableWrapper>
  )
}
