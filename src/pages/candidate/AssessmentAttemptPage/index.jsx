import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { candidateAssessmentKeys, getCandidateAssessment } from '../../../api/attempts'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { Button } from '../../../components/ui/Button'
import { Card, TitleRow, Title, Muted, Metadata, RulesList, Actions, ErrorState } from './styles'
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { formatMinutes, formatDate } from '../../../utils/helpers'



const statusTone = {
  assigned: 'info',
  in_progress: 'warning',
  submitted: 'success',
}

const statusLabel = {
  assigned: 'Not started',
  in_progress: 'In progress',
  submitted: 'Submitted',
}


const violationLabels = {
  tab_switch: 'Tab switch',
  window_blur: 'Window blur',
  fullscreen_exit: 'Fullscreen exit',
  copy: 'Copy',
  paste: 'Paste',
  right_click: 'Right-click',
}

const actionLabel = (status,  blocked) => {
  if (blocked) return 'Back to Assignments'
  if (status === 'in_progress') return 'Resume assessment'
  return 'Start assessment'
}

export function AssessmentAttemptPage() {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const query = useQuery({
    queryKey: candidateAssessmentKeys.detail(assignmentId),
    queryFn: () => getCandidateAssessment({ assignmentId }),
  })

  const data = query.data
  const attempt = data?.attempt
  const assignment = data?.assignment
  const assessment = data?.assessment

  const isCancelled = assignment?.status === 'cancelled'
  const isExpired = assignment?.expiresAt ? new Date(assignment.expiresAt) < new Date() : false
  const isSubmitted = attempt?.status === 'submitted'
  const blocked = isSubmitted || isCancelled || isExpired;

  const handleAction = () => {
    if (blocked) {
      navigate(`/candidate/assignments`);
    } else {
      const attemptUrl = `/candidate/assignments/${assignmentId}/attempt`
      window.open(attemptUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <DashboardLayout title="Assessment attempt" role="Candidate" hideNavigation>
      {query.isLoading && <CommonLoader label="Loading assessment..." />}
      {query.isError && <ErrorState role="alert">{query.error.message}</ErrorState>}
      {data && (
        <Card>
          <div>
            <TitleRow>
              <Title>{assessment.title}</Title>
              <Pill tone={statusTone[attempt.status] || 'neutral'}>{statusLabel[attempt.status] || attempt.status}</Pill>
              {isCancelled && <Pill tone="warning">Cancelled</Pill>}
              {!isCancelled && isExpired && attempt.status !== 'submitted' && <Pill tone="warning">Expired</Pill>}
            </TitleRow>
            {assignment.description && <Muted>{assignment.description}</Muted>}
          </div>

          <Metadata>
            <Pill tone="neutral">{assessment.questions.length} questions</Pill>
            <Pill tone="info">Duration: {formatMinutes(assignment.durationMinutes)}</Pill>
            <Pill tone="neutral">{assessment.totalPoints} points</Pill>
            <Pill tone="info">Expires at: {formatDate(assignment.expiresAt)}</Pill>
            {isSubmitted && (
              <Pill tone='info'>
                Submitted on: {formatDate(attempt.submittedAt)}
              </Pill>  
            )}
          </Metadata>


          {data.attempt.status !== 'submitted' ? (
              <>
          <div>
            <h3>Proctoring rules</h3>
            <Muted>This assessment is monitored. The following actions are tracked and may be limited:</Muted>
            <RulesList>
            <Table>
              <TableHead>
                <TableCell>Rule</TableCell>
                <TableCell>Limit</TableCell>
              </TableHead>
              <TableBody>

              {Object.entries(violationLabels).map(([key, label]) => (
                <TableRow key={key}>
                <TableCell>
                  {label.toUpperCase()}
                </TableCell>
                <TableCell>
                  {assignment.violationLimits?.[key] !== undefined && `${assignment.violationLimits[key]}`}
                </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
            </RulesList>
          </div>
          </>
          ): ( 
          
          blocked && (
            <>
            <ErrorState role="alert">
              This assignment has {isSubmitted ? 'been submitted' : 'expired'} and can no longer be attempted.
            </ErrorState>
            </>
          )
        )}
          <Actions>
            <Button type="button" onClick={handleAction}>
              {actionLabel(attempt.status, blocked)}
            </Button>
          </Actions>
        </Card>
      )}
    </DashboardLayout>
  )
}
