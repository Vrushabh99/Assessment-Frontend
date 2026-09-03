import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import { listQuestions, normalizeQuestion, questionKeys } from '../../../api/questions'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { QuestionTable } from '../../../components/QuestionTable'
import { Button } from '../../../components/ui/Button'
import { DropDown } from '../../../components/ui/DropDown'
import { TextField } from '../../../components/ui/TextField'
import { CommonLoader } from '../../../components/ui/CommonLoader'

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
const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
  @media (max-width: 480px) { justify-content: space-between; padding: 14px; }
`

export function QuestionsDashboardPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 2

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timeout)
  }, [search])

  useEffect(() => setPage(1), [debouncedSearch])

  const questionsQuery = useQuery({
    queryKey: [...questionKeys.all, { page, limit, search: debouncedSearch }],
    queryFn: () => listQuestions({ page, limit, search: debouncedSearch }),
    placeholderData: (previousData) => previousData,
  })
  const questions = (questionsQuery.data?.items || []).map(normalizeQuestion)

  const filteredQuestions = useMemo(() => questions.filter((question) => {
    const matchesSearch = question.questionText.toLowerCase().includes(search.toLowerCase())
      || question.id.toLowerCase().includes(search.toLowerCase())
    const matchesType = type === 'all' || question.type === type
    const matchesStatus = status === 'all' || question.status === status
    return matchesSearch && matchesType && matchesStatus
  }), [questions, search, status, type])

  if (questionsQuery.isLoading) return <DashboardLayout title="Questions" role="Administrator"><CommonLoader label="Loading questions..." /></DashboardLayout>
  if (questionsQuery.isError) return <DashboardLayout title="Questions" role="Administrator"><Muted role="alert">{questionsQuery.error.message}</Muted></DashboardLayout>

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
        <StatCard><StatLabel>Published</StatLabel><StatValue>{questions.filter(({ status }) => status === 'published').length}</StatValue></StatCard>
        <StatCard><StatLabel>Used in assessments</StatLabel><StatValue>{questions.reduce((total, question) => total + question.usage, 0)}</StatValue></StatCard>
      </Stats>
      <Card>
        <Toolbar>
          <TextField id="question-search" aria-label="Search questions" placeholder="Search by question or ID" value={search} onChange={(event) => setSearch(event.target.value)} />
          <DropDown id="question-type-filter" aria-label="Filter by question type" value={type} onChange={(event) => setType(event.target.value)} options={[{ value: 'all', label: 'All types' }, { value: 'single-choice', label: 'Single choice' }, { value: 'multiple-choice', label: 'Multiple choice' }, { value: 'short-answer', label: 'Short answer' }]} />
          <DropDown id="question-status-filter" aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)} options={[{ value: 'all', label: 'All statuses' }, { value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} />
        </Toolbar>
        <QuestionTable questions={filteredQuestions} onEdit={(question) => navigate(`/admin/questions/${question.id}/edit`)} />
        {(questionsQuery.data?.totalPages || 1) > 1 && (
          <Pagination>
            <Button type="button" variant="secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span>Page {page} of {questionsQuery.data.totalPages}</span>
            <Button type="button" variant="secondary" disabled={page === questionsQuery.data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </Pagination>
        )}
      </Card>
    </DashboardLayout>
  )
}
