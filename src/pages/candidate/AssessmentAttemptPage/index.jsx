import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { candidateAssessmentKeys, getCandidateAssessment } from '../../../api/attempts'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { Button } from '../../../components/ui/Button'
import { Card, TitleRow, Title, Muted, Metadata, RulesList, Actions, ErrorState } from './styles'

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

const violationLabels = {
  tab_switch: 'Tab switch',
  window_blur: 'Window blur',
  fullscreen_exit: 'Fullscreen exit',
  copy: 'Copy',
  paste: 'Paste',
  right_click: 'Right-click',
}

const actionLabel = (status) => {
  if (status === 'submitted') return 'View result'
  if (status === 'in_progress') return 'Resume assessment'
  return 'Start assessment'
}

export function AssessmentAttemptPage() {
  const { assessmentId, assignmentId } = useParams()
  const query = useQuery({
    queryKey: candidateAssessmentKeys.detail(assessmentId, assignmentId),
    queryFn: () => getCandidateAssessment({ assessmentId, assignmentId }),
  })

  const data = query.data
  const attempt = data?.attempt
  const assignment = data?.assignment
  const assessment = data?.assessment

  const isCancelled = assignment?.status === 'cancelled'
  const isExpired = assignment?.expiresAt ? new Date(assignment.expiresAt) < new Date() : false
  const blocked = attempt?.status !== 'submitted' && (isCancelled || isExpired)

  const handleAction = () => {
    if (blocked) return
    const attemptUrl = `/candidate/assessments/${assessmentId}/assignments/${assignmentId}/attempt`
    const newWindow = window.open(attemptUrl, 'assessment_attempt', 'width=1200,height=800')
    if (newWindow) {
      newWindow.addEventListener('load', () => {
        if (newWindow.document.documentElement.requestFullscreen) {
          newWindow.document.documentElement.requestFullscreen()
        }
      })
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
            <Pill tone="neutral">{assignment.durationMinutes} minutes</Pill>
            <Pill tone="neutral">{assessment.totalPoints} points</Pill>
            <Pill tone="neutral">{formatDate(assignment.expiresAt)}</Pill>
            {attempt.status === 'submitted' && <Pill tone="success">Submitted</Pill>}
          </Metadata>

          <div>
            <h3>Proctoring rules</h3>
            <Muted>This assessment is monitored. The following actions are tracked and may be limited:</Muted>
            <RulesList>
              {Object.entries(violationLabels).map(([key, label]) => (
                <li key={key}>
                  {label}
                  {assignment.violationLimits?.[key] !== undefined && ` — limit: ${assignment.violationLimits[key]}`}
                </li>
              ))}
            </RulesList>
          </div>

          {blocked && (
            <ErrorState role="alert">
              {isCancelled ? 'This assignment has been cancelled and can no longer be attempted.' : 'This assignment has expired and can no longer be attempted.'}
            </ErrorState>
          )}

          <Actions>
            <Button type="button" disabled={blocked} onClick={handleAction}>
              {actionLabel(attempt.status)}
            </Button>
          </Actions>
        </Card>
      )}
    </DashboardLayout>
  )
}
