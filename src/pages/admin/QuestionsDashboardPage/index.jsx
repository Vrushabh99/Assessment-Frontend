import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { QuestionTable } from '../../../components/QuestionTable'
import { Button } from '../../../components/ui/Button'
import { DropDown } from '../../../components/ui/DropDown'
import { TextField } from '../../../components/ui/TextField'

const initialQuestions = [
  { id: 'Q-1001', title: 'What is the purpose of a database index?', type: 'Single choice', difficulty: 'Easy', usage: 12, status: 'Published', additionalInfo: { options: ['Faster queries', 'More storage'], correctAnswers: [0] } },
  { id: 'Q-1002', title: 'Select the valid HTTP methods.', type: 'Multiple choice', difficulty: 'Medium', usage: 8, status: 'Published', additionalInfo: { options: ['GET', 'POST', 'FETCH'], correctAnswers: [0, 1] } },
  { id: 'Q-1003', title: 'Explain how JWT authentication works.', type: 'Short answer', difficulty: 'Hard', usage: 5, status: 'Draft', additionalInfo: { expectedAnswer: 'A signed token containing claims.' } },
  { id: 'Q-1004', title: 'Which principle does REST follow?', type: 'Single choice', difficulty: 'Easy', usage: 16, status: 'Published', additionalInfo: { options: ['Statelessness', 'Global state'], correctAnswers: [0] } },
]

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 640px) { flex-direction: column; }
`
const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`
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

export function QuestionsDashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All types')
  const savedQuestion = location.state?.savedQuestion
  const questions = useMemo(() => savedQuestion
    ? [...initialQuestions.filter(({ id }) => id !== savedQuestion.id), savedQuestion]
    : initialQuestions, [savedQuestion])

  const filteredQuestions = useMemo(() => questions.filter((question) => {
    const matchesSearch = question.title.toLowerCase().includes(search.toLowerCase())
      || question.id.toLowerCase().includes(search.toLowerCase())
    const matchesType = type === 'All types' || question.type === type
    return matchesSearch && matchesType
  }), [questions, search, type])

  return (
    <DashboardLayout title="Questions" role="Administrator">
      <Header>
        <div>
          <h2>Question bank</h2>
          <Muted>Create, organize, and reuse questions across assessments.</Muted>
        </div>
        <Button type="button" onClick={() => navigate('/admin/questions/new')}>+ Add question</Button>
      </Header>
      <Stats>
        <StatCard><StatLabel>Total questions</StatLabel><StatValue>{questions.length}</StatValue></StatCard>
        <StatCard><StatLabel>Published</StatLabel><StatValue>{questions.filter(({ status }) => status === 'Published').length}</StatValue></StatCard>
        <StatCard><StatLabel>Used in assessments</StatLabel><StatValue>{questions.reduce((total, question) => total + question.usage, 0)}</StatValue></StatCard>
      </Stats>
      <Card>
        <Toolbar>
          <TextField id="question-search" aria-label="Search questions" placeholder="Search by question or ID" value={search} onChange={(event) => setSearch(event.target.value)} />
          <DropDown id="question-type-filter" aria-label="Filter by question type" value={type} onChange={(event) => setType(event.target.value)} options={['All types', 'Single choice', 'Multiple choice', 'Short answer'].map((value) => ({ value, label: value }))} />
        </Toolbar>
        <QuestionTable questions={filteredQuestions} onEdit={(question) => navigate(`/admin/questions/${question.id}/edit`, { state: { question } })} />
      </Card>
    </DashboardLayout>
  )
}
