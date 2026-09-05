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
import { useAuth } from '../../../context/AuthContext'

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
const TabList = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`
const Tab = styled.button`
  flex: 1;
  padding: 16px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.muted};
  border-bottom: 3px solid ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.background};
  }

  @media (max-width: 640px) {
    padding: 12px 16px;
    font-size: 0.9rem;
  }
`
const TabCount = styled.span`
  margin-left: 8px;
  font-size: 0.85rem;
  opacity: 0.7;
`

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

const TAB_FILTERS = [
  { id: 'new', label: 'New', statuses: ['assigned'] },
  { id: 'resume', label: 'Resume', statuses: ['in_progress'] },
  { id: 'completed', label: 'Completed', statuses: ['submitted'] },
  { id: 'graded', label: 'Graded', statuses: ['graded'] },
]

const formatDate = (value) => {
  if (!value) return 'No expiry'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'No expiry'
    : `Expires ${date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', hour12: true })}`
}

const actionLabel = (assessment) => {
  if (!assessment.accessible) return 'Unavailable';
  if (assessment.status === 'assigned') return 'Start';
  if (assessment.status === 'in_progress') return 'Resume';
  if (assessment.status === 'submitted' && assessment.isFullyScored) return 'View result';
  return null;
}

const ActionButton = ({ assessment, handleOpen}) => {

  const label = actionLabel(assessment);
  if (!label) return null;
  return (
    <Button
                type="button"
                disabled={!assessment.accessible}
                onClick={() => handleOpen(assessment)}
              >
                {label}
              </Button>
  )
}

const StatusPill = ({ assessment }) => {
  const { status, isFullyScored, accessible, reason } = assessment;
  let tone;
  let label;
  console.log(status);

  if (!accessible) {
    return(
      <Pill tone="warning">{reason === 'cancelled' ? 'Cancelled' : 'Expired'}</Pill>
    );
  }

  switch(status) {
    case 'submitted': { tone = 'success'; label = isFullyScored ? 'Graded' : 'Submitted'; break; }
    case 'assigned' : { tone = 'warning'; label = 'Not Started'; break; }
    default: tone = 'warning'; label = 'In Progress';
  }
 
  return(
    <Pill
      tone={tone}
    >
      {label}
    </Pill>
  )
}

export function CandidateDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('new')
  const [page, setPage] = useState(1);
  const limit = 25;
  const query = useQuery({
    queryKey: attemptKeys.all({ page, limit, status: activeTab }),
    queryFn: () => {
      const status = TAB_FILTERS.find(ele => ele.id === activeTab)?.statuses[0];
      return listMyAssessments({ status });
    },
  })

  const assessments = query.data || [];
  const handleOpen = (assessment) => {
    if (!assessment.accessible) return;
    navigate(`/candidate/assignment/${assessment.assignmentId}/${user.id}/result`);
  }


  return (
    <DashboardLayout title="Candidate workspace" role="Candidate">
      <Card>
        <TabList role="tablist">
          {TAB_FILTERS.map((tab) => (
            <Tab
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>
        {/* <Toolbar>
          <TextField id="assessment-search" aria-label="Search assessments" placeholder="Search assessments" value={search} onChange={(event) => setSearch(event.target.value)} />
        </Toolbar> */}
        {query.isLoading && <CommonLoader label="Loading assessments..." />}
        {query.isError && <EmptyState role="alert">{query.error.message}</EmptyState>}
        {!query.isLoading && !query.isError && !assessments.length && <EmptyState>No assessments in this tab.</EmptyState>}
        <AssessmentList>
          {assessments.map((assessment) => (
            <AssessmentCard key={assessment.attemptId}>
              <AssessmentContent>
                <TitleRow>
                  <Title>{assessment.title || 'Untitled assessment'}</Title>
                  <StatusPill
                    assessment={assessment}
                  />
                </TitleRow>
                {assessment.description && <Description>{assessment.description}</Description>}
                <Metadata>
                  <Pill tone="neutral">{assessment.durationMinutes || 0} minutes</Pill>
                  <Pill tone="neutral">{formatDate(assessment.expiresAt)}</Pill>
                  {assessment.status === 'submitted' && <Pill tone="warning">Score: {assessment.score ?? '-'}</Pill>}
                </Metadata>
              </AssessmentContent>
              <ActionButton
                assessment={assessment}
                handleOpen={() => handleOpen(assessment)}
              />
            </AssessmentCard>
          ))}
        </AssessmentList>
      </Card>
    </DashboardLayout>
  )
}
