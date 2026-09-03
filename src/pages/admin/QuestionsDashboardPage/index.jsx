import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { QuestionTable } from '../../../components/QuestionTable'

const questions = [
  { id: 'Q-1001', title: 'What is the purpose of a database index?', type: 'Single choice', difficulty: 'Easy', usage: 12, status: 'Published' },
  { id: 'Q-1002', title: 'Select the valid HTTP methods.', type: 'Multiple choice', difficulty: 'Medium', usage: 8, status: 'Published' },
  { id: 'Q-1003', title: 'Explain how JWT authentication works.', type: 'Short answer', difficulty: 'Hard', usage: 5, status: 'Draft' },
  { id: 'Q-1004', title: 'Which principle does REST follow?', type: 'Single choice', difficulty: 'Easy', usage: 16, status: 'Published' },
]

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 640px) { flex-direction: column; }
`
const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`
const PrimaryButton = styled.button`
  border: 0; border-radius: 8px; background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.surface}; cursor: pointer; font: inherit;
  font-weight: 600; padding: 11px 16px; white-space: nowrap;
`
const Stats = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`
const StatCard = styled.article`
  padding: 20px; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px; background: ${({ theme }) => theme.colors.surface};
`
const StatLabel = styled.span`color: ${({ theme }) => theme.colors.muted};`
const StatValue = styled.strong`display: block; margin-top: 6px; font-size: 1.75rem;`
const Card = styled.section`
  overflow: hidden; border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px; background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
const Toolbar = styled.div`
  display: flex; gap: 12px; padding: 20px; border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 640px) { flex-direction: column; }
`
const Search = styled.input`
  flex: 1; border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 8px; font: inherit; padding: 10px 12px;
`
const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  border-radius: 8px; background: ${({ theme }) => theme.colors.surface}; font: inherit; padding: 10px 12px;
`

export function QuestionsDashboardPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All types')

  const filteredQuestions = useMemo(() => questions.filter((question) => {
    const matchesSearch = question.title.toLowerCase().includes(search.toLowerCase())
      || question.id.toLowerCase().includes(search.toLowerCase())
    const matchesType = type === 'All types' || question.type === type
    return matchesSearch && matchesType
  }), [search, type])

  return (
    <DashboardLayout title="Questions" role="Administrator">
      <Header>
        <div>
          <h2>Question bank</h2>
          <Muted>Create, organize, and reuse questions across assessments.</Muted>
        </div>
        <PrimaryButton type="button">+ Add question</PrimaryButton>
      </Header>
      <Stats>
        <StatCard><StatLabel>Total questions</StatLabel><StatValue>{questions.length}</StatValue></StatCard>
        <StatCard><StatLabel>Published</StatLabel><StatValue>{questions.filter(({ status }) => status === 'Published').length}</StatValue></StatCard>
        <StatCard><StatLabel>Used in assessments</StatLabel><StatValue>{questions.reduce((total, question) => total + question.usage, 0)}</StatValue></StatCard>
      </Stats>
      <Card>
        <Toolbar>
          <Search aria-label="Search questions" placeholder="Search by question or ID" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select aria-label="Filter by question type" value={type} onChange={(event) => setType(event.target.value)}>
            <option>All types</option>
            <option>Single choice</option>
            <option>Multiple choice</option>
            <option>Short answer</option>
          </Select>
        </Toolbar>
        <QuestionTable questions={filteredQuestions} />
      </Card>
    </DashboardLayout>
  )
}
