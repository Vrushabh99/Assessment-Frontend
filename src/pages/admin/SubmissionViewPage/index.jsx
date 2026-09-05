import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import { useState } from 'react'
import { getSubmission, submissionKeys, updateSubmissionGrade } from '../../../api/submissions'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { TextField } from '../../../components/ui/TextField'
import { NumberField } from '../../../components/ui/NumberField'
import { QuestionRenderer } from '../../../components/QuestionRenderer'
import { QUESTION_RENDERER_MODES } from '../../../components/QuestionRenderer/constants'
const Container = styled.div`
  display: grid;
  gap: 24px;
`

const Card = styled.section`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
  }
`

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const MetadataRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  text-transform: Uppercase;
`

const Muted = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  font-size: 0.9rem;
`

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: 24px 0;
`

const QuestionBlock = styled.div`
  margin-bottom: 32px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  border-radius: 8px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`

const QuestionText = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
  font-size: 1.1rem;
`

const AnswerSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 16px;
  border-radius: 8px;
  margin: 8px 0;
  display: flex;
  gap: 8px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const AnswerLabel = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const AnswerContent = styled.div`
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  white-space: pre-wrap;
  line-height: 1.6;
`

const GradingSection = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: 8px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  margin-top: 8px;
  gap: 12px;
`

const FormRow = styled.div`
  display: flex;
  width: 100%;
  gap: 12px;
  justify-content: flex-end;
  input {
    padding: 6px;
    width: 80px;
  }
`

const ScoreWrapper = styled.div`
  display: flex;
  font-size: 16px;
  align-items: center;
`
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const SubmissionInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  border-radius: 8px;
  margin-bottom: 24px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const InfoLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 1.1rem;
`

const SuccessMessage = styled.div`
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.colors.successBackground};
  color: ${({ theme }) => theme.colors.successText};
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid ${({ theme }) => theme.colors.successText};
`

const formatDate = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'N/A'
    : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', hour12: true })
}

const StatusPill = ({ submission }) => {
  const { status, isFullyScored } = submission;
  let tone;
  let label;
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
export function SubmissionViewPage() {
  const navigate = useNavigate()
  const { assignmentId, candidateId } = useParams()
  const location = useLocation()
  const isGradingMode = location.pathname.includes('/grade')

  const [gradingData, setGradingData] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const queryClient = useQueryClient()

  const submissionQuery = useQuery({
    queryKey: submissionKeys.detail( assignmentId, candidateId),
    queryFn: () => getSubmission(assignmentId, candidateId),
  })

  const gradeMutation = useMutation({
    mutationFn: (gradeInfo) => updateSubmissionGrade(gradeInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.detail(assignmentId, candidateId) })
      setSuccessMessage('Grade saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    },
  })

  if (submissionQuery.isLoading) {
    return (
      <DashboardLayout title="Submission" role="Administrator">
        <CommonLoader label="Loading submission..." />
      </DashboardLayout>
    )
  }

  if (submissionQuery.isError) {
    return (
      <DashboardLayout title="Submission" role="Administrator">
        <Muted role="alert">{submissionQuery.error.message}</Muted>
      </DashboardLayout>
    )
  }


  const submission = submissionQuery.data
  const pageTitle = isGradingMode ? 'Grade Submission' : 'View Submission'

  const handleSaveGrade = async (questionId) => {
    const data = gradingData[questionId]
    if (!data) return

    await gradeMutation.mutateAsync({
      attemptId: submission.attemptId,
      questionId,
      score: parseInt(data.score, 10),
    })
  }

  const handleGradeChange = (questionId, field, value) => {
    setGradingData((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [field]: value,
      },
    }))
  }

  return (
    <DashboardLayout title={pageTitle} role="Administrator">
      <Container>
        <Card>
          <Header>
            <HeaderContent>
              <h2>
                {isGradingMode ? 'Grade Submission' : 'View Submission'}
              </h2>
              <MetadataRow>
                <StatusPill
                  submission={submission}
                />
                {submission.autoSubmittedReason === 'violation_limit_exceeded' && (
                <Pill tone="warning">
                  Violated: {submission.autoSubmittedViolationType}
                </Pill>
            )}
              </MetadataRow>
            </HeaderContent>
            <HeaderActions>
              <Button variant="primary" onClick={() => navigate(-1)}>
                Back
              </Button>
            </HeaderActions>
          </Header>

          <SubmissionInfo>
            <InfoItem>
              <InfoLabel>Student</InfoLabel>
              <InfoValue>{submission.candidate.fullName || 'Unknown'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{submission.candidate.email || 'N/A'}</InfoValue>
            </InfoItem>
          </SubmissionInfo>
          <SubmissionInfo>
            <InfoItem>
              <InfoLabel>Assessment</InfoLabel>
              <InfoValue>{submission.assessment.title || 'N/A'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Submitted</InfoLabel>
              <InfoValue>{formatDate(submission.submittedAt)}</InfoValue>
            </InfoItem>
            {submission.score !== undefined && (
              <InfoItem>
                <InfoLabel>Score</InfoLabel>
                <InfoValue>
                  {submission.score} / {submission.total || 0}
                </InfoValue>
              </InfoItem>
            )}
          </SubmissionInfo>
        </Card>

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        {submission.questions && submission.questions.length > 0 && (
          <Card>
            <h3 style={{ marginTop: 0 }}>Responses</h3>
            {submission.questions.map((question, index) => (
              <div key={question.questionId || index}>
                <QuestionBlock>
                  <QuestionRenderer
                    question={question}
                    mode={QUESTION_RENDERER_MODES.TEACHER}
                    answer={question.answer ?? null}
                  />

                  {question.correctAnswer && (
                    <AnswerSection>
                      <AnswerLabel>Correct Answer</AnswerLabel>
                      <AnswerContent>{question.correctAnswer}</AnswerContent>
                    </AnswerSection>
                  )}

                  {isGradingMode && question.type === 'short-answer' && question.answer && (
                    <GradingSection>
                      <FormRow>
                        <ScoreWrapper>
                          <NumberField
                            id={`score-${question.questionId}`}
                            min="0"
                            max={question.maxScore || 10}
                            value={gradingData[question.questionId]?.score || question?.marksObtained}
                            onChange={(e) =>
                              handleGradeChange(question.questionId, 'score', e.target.value)
                            }
                            placeholder="Score"
                            />
                          /
                          <Muted>{question.maxScore || 10} points</Muted>
                        </ScoreWrapper>
                      <ButtonGroup>
                        <Button
                          onClick={() => handleSaveGrade(question.questionId)}
                          disabled={gradeMutation.isPending}
                        >
                          {gradeMutation.isPending ? 'Saving...' : 'Save Grade'}
                        </Button>
                      </ButtonGroup>
                      </FormRow>
                    </GradingSection>
                  )}

                  {question.score !== undefined && (
                    <AnswerSection>
                      <AnswerLabel>Score</AnswerLabel>
                      <AnswerContent>
                        {question.score} / {question.points || 10}
                      </AnswerContent>
                      {!question.type === 'short-answer' && (
                        <Pill tone={'warning'}>
                          Auto-Scored
                        </Pill>
                      )}
                    </AnswerSection>
                  )}
                </QuestionBlock>

                {index < submission.questions.length - 1 && <Divider />}
              </div>
            ))}
          </Card>
        )}
      </Container>
    </DashboardLayout>
  )
}
