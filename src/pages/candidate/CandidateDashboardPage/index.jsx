import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import { attemptKeys, listMyAssessments } from '../../../api/attempts'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { Button } from '../../../components/ui/Button'
import { TextField } from '../../../components/ui/TextField'
import { DropDown } from '../../../components/ui/DropDown'

const Header = styled.div`
  margin-bottom: 20px;
`
const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`
const Card = styled.section`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 640px) { flex-direction: column; }
`
const AssessmentList = styled.div`display: grid; gap: 12px; padding: 20px;`
const AssessmentCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  @media (max-width: 640px) { align-items: flex-start; flex-direction: column; }
`
const AssessmentContent = styled.div`display: grid; gap: 10px; min-width: 0;`
const TitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`
const Title = styled.h3`margin: 0;`
const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const Metadata = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`
const EmptyState = styled.p`padding: 28px 20px; color: ${({ theme }) => theme.colors.muted}; text-align: center;`

const statusTone = {
  assigned: 'neutral',
  in_progress: 'warning',
  submitted: 'success',
}

const statusLabel = {
  assigned: 'Not started',
  in_progress: 'In progress',
  submitted: 'Submitted',
}

const formatDate = (value) => {
  if (!value) return 'No expiry'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'No expiry'
    : `Expires ${date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', hour12: true })}`
}

const actionLabel = (assessment) => {
  if (!assessment.accessible) return 'Unavailable'
  if (assessment.status === 'submitted') return 'View result'
  if (assessment.status === 'in_progress') return 'Resume'
  return 'Start'
}

export function CandidateDashboardPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const query = useQuery({
    queryKey: attemptKeys.all,
    queryFn: listMyAssessments,
  })

  const assessments = useMemo(() => {
    const list = query.data || []
    const normalizedSearch = search.trim().toLowerCase()
    return list.filter((assessment) => {
      if (status !== 'all' && assessment.status !== status) return false
      if (!normalizedSearch) return true
      return (assessment.title || '').toLowerCase().includes(normalizedSearch)
    })
  }, [query.data, search, status])

  const handleOpen = (assessment) => {
    if (!assessment.accessible) return
    navigate(`/candidate/assessments/${assessment.assessmentId}/assignments/${assessment.assignmentId}`)
  }

  return (
    <DashboardLayout title="Candidate workspace" role="Candidate">
      <Header>
        <h2>Assigned assessments</h2>
        <Muted>Start, resume, or review your assigned assessments below.</Muted>
      </Header>
      <Card>
        <Toolbar>
          <TextField id="assessment-search" aria-label="Search assessments" placeholder="Search assessments" value={search} onChange={(event) => setSearch(event.target.value)} />
          <DropDown
            id="assessment-status-filter"
            aria-label="Filter assessments by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[
              { value: 'all', label: 'All statuses' },
              { value: 'assigned', label: 'Not started' },
              { value: 'in_progress', label: 'In progress' },
              { value: 'submitted', label: 'Submitted' },
            ]}
          />
        </Toolbar>
        {query.isLoading && <CommonLoader label="Loading assessments..." />}
        {query.isError && <EmptyState role="alert">{query.error.message}</EmptyState>}
        {!query.isLoading && !query.isError && !assessments.length && <EmptyState>No assessments match your filters.</EmptyState>}
        <AssessmentList>
          {assessments.map((assessment) => (
            <AssessmentCard key={assessment.attemptId}>
              <AssessmentContent>
                <TitleRow>
                  <Title>{assessment.title || 'Untitled assessment'}</Title>
                  <Pill tone={statusTone[assessment.status] || 'neutral'}>{statusLabel[assessment.status] || assessment.status}</Pill>
                  {!assessment.accessible && (
                    <Pill tone="warning">{assessment.reason === 'cancelled' ? 'Cancelled' : 'Expired'}</Pill>
                  )}
                </TitleRow>
                {assessment.description && <Description>{assessment.description}</Description>}
                <Metadata>
                  <Pill tone="neutral">{assessment.durationMinutes || 0} minutes</Pill>
                  <Pill tone="neutral">{formatDate(assessment.expiresAt)}</Pill>
                  {assessment.status === 'submitted' && <Pill tone="neutral">Score: {assessment.score ?? '-'}</Pill>}
                </Metadata>
              </AssessmentContent>
              <Button
                type="button"
                disabled={!assessment.accessible}
                onClick={() => handleOpen(assessment)}
              >
                {actionLabel(assessment)}
              </Button>
            </AssessmentCard>
          ))}
        </AssessmentList>
      </Card>
    </DashboardLayout>
  )
}
