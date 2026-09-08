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
import { formatDate, formatMinutes } from '../../../utils/helpers'
import { Tabs } from '../../../components/ui/TabList'

const Card = styled.section`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
const AssessmentList = styled.div`display: grid; gap: 12px; padding: 16px;`
const AssessmentCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  @media (max-width: 640px) { align-items: flex-start; flex-direction: column; padding: 16px 10px}
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



const TAB_FILTERS = [
  { id: 'assigned', label: 'Assigned', statuses: ['assigned'] },
  { id: 'resume', label: 'Resume', statuses: ['in_progress'] },
  { id: 'submitted', label: 'Submitted', statuses: ['submitted'] },
  { id: 'graded', label: 'Graded', statuses: ['graded'] },
  { id: 'expired', label: 'Expired', statuses: ['expired'] },
]


const actionLabel = (assessment) => {
  if (!assessment.accessible) return 'Unavailable';
  if (assessment.status === 'assigned') return 'Start';
  if (assessment.status === 'in_progress') return 'Resume';
  if (assessment.status === 'submitted' && assessment.isFullyScored) return 'Result';
  return null;
}

const ActionButton = ({ assessment, handleOpen}) => {

  const label = actionLabel(assessment);
  if (!label) return null;
  return (
    <Button
      type="button"
      disabled={!assessment.accessible}
      onClick={() => handleOpen(assessment, label)}
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
  const [activeTab, setActiveTab] = useState('assigned')
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
  const handleOpen = (assessment, label) => {

    switch(label) {
        case 'Start':
        case 'Resume': navigate(`/candidate/assignment/${assessment.assignmentId}`); break;
        case 'Result': navigate(`/candidate/assignment/${assessment.assignmentId}/result`); break;
        case 'Unavailable': break;
        default: return;
    }
  }


  return (
    <DashboardLayout title="Candidate workspace" role="Candidate">
      <Card>
        <Tabs
          activeTab={activeTab}
          tabs={TAB_FILTERS}
          onChange={setActiveTab}
        />
        {query.isLoading && <CommonLoader label="Loading assessments..." />}
        {query.isError && <EmptyState role="alert">{query.error.message}</EmptyState>}
        {!query.isLoading && !query.isError && !assessments.length && <EmptyState>No assessments in this tab.</EmptyState>}
        <AssessmentList>
          {assessments.map((assessment) => {
            const expiresAt = formatDate(assessment.expiresAt)
            return(
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
                  <Pill tone="neutral">Duration: {formatMinutes(assessment.durationMinutes)}</Pill>
                  {expiresAt !== '-' && (<Pill tone="neutral">Expires at: {expiresAt}</Pill>)}
                  {assessment.status === 'submitted' && assessment.isFullyScored && <Pill tone="warning">Score: {assessment.score ?? '-'}</Pill>}
                </Metadata>
              </AssessmentContent>
              <ActionButton
                assessment={assessment}
                handleOpen={(assessment, label) => handleOpen(assessment, label)}
              />
            </AssessmentCard>
          )})}
        </AssessmentList>
      </Card>
    </DashboardLayout>
  )
}
