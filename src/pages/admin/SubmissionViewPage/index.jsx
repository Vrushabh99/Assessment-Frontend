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
  @media (max-width: 640px) {
    flex-direction: column;
  }
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
  margin-bottom: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const AnswerLabel = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: 8px;
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
  padding: 16px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  display: grid;
  gap: 12px;
`

const GradingLabel = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`

const FormRow = styled.div`
  display: grid;
  gap: 12px;
  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
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

export function SubmissionViewPage() {
  const navigate = useNavigate()
  const { submissionId } = useParams()
  const location = useLocation()
  const isGradingMode = location.pathname.includes('/grade')

  const [gradingData, setGradingData] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const queryClient = useQueryClient()

  const submissionQuery = useQuery({
    queryKey: submissionKeys.detail(submissionId),
    queryFn: () => getSubmission(submissionId),
  })

  const gradeMutation = useMutation({
    mutationFn: (gradeInfo) => updateSubmissionGrade(gradeInfo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: submissionKeys.detail(submissionId) })
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
      submissionId,
      questionId,
      score: data.score,
      feedback: data.feedback,
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
              <h2>{isGradingMode ? 'Grade Submission' : 'View Submission'}</h2>
              <MetadataRow>
                <Pill tone={submission.status === 'graded' ? 'success' : 'warning'}>
                  {submission.status || 'submitted'}
                </Pill>
              </MetadataRow>
            </HeaderContent>
            <HeaderActions>
              <Button variant="secondary" onClick={() => navigate(-1)}>
                Back
              </Button>
            </HeaderActions>
          </Header>

          <SubmissionInfo>
            <InfoItem>
              <InfoLabel>Student</InfoLabel>
              <InfoValue>{submission.candidateName || 'Unknown'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{submission.candidateEmail || 'N/A'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Assessment</InfoLabel>
              <InfoValue>{submission.assessmentTitle || 'N/A'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Submitted</InfoLabel>
              <InfoValue>{formatDate(submission.submittedAt)}</InfoValue>
            </InfoItem>
            {submission.score !== undefined && (
              <InfoItem>
                <InfoLabel>Score</InfoLabel>
                <InfoValue>
                  {submission.score} / {submission.totalPoints || 0}
                </InfoValue>
              </InfoItem>
            )}
          </SubmissionInfo>
        </Card>

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        {submission.answers && submission.answers.length > 0 && (
          <Card>
            <h3 style={{ marginTop: 0 }}>Responses</h3>
            {submission.answers.map((answer, index) => (
              <div key={answer.questionId || index}>
                <QuestionBlock>
                  <QuestionText>
                    Q{index + 1}. {answer.questionText || 'Question'}
                  </QuestionText>

                  <AnswerSection>
                    <AnswerLabel>Student Answer</AnswerLabel>
                    <AnswerContent>
                      {answer.textAnswer || answer.selectedOptions?.join(', ') || 'No answer provided'}
                    </AnswerContent>
                  </AnswerSection>

                  {answer.correctAnswer && (
                    <AnswerSection>
                      <AnswerLabel>Correct Answer</AnswerLabel>
                      <AnswerContent>{answer.correctAnswer}</AnswerContent>
                    </AnswerSection>
                  )}

                  {isGradingMode && answer.questionType === 'short-text' && (
                    <GradingSection>
                      <AnswerLabel>Grading</AnswerLabel>
                      <FormRow>
                        <div>
                          <GradingLabel>Score</GradingLabel>
                          <NumberField
                            id={`score-${answer.questionId}`}
                            min="0"
                            max={answer.maxScore || 10}
                            value={gradingData[answer.questionId]?.score || ''}
                            onChange={(e) =>
                              handleGradeChange(answer.questionId, 'score', e.target.value)
                            }
                            placeholder="Enter score"
                          />
                        </div>
                        <div>
                          <GradingLabel>Max Score</GradingLabel>
                          <Muted>{answer.maxScore || 10} points</Muted>
                        </div>
                      </FormRow>
                      <div>
                        <GradingLabel>Feedback</GradingLabel>
                        <TextField
                          id={`feedback-${answer.questionId}`}
                          value={gradingData[answer.questionId]?.feedback || ''}
                          onChange={(e) =>
                            handleGradeChange(answer.questionId, 'feedback', e.target.value)
                          }
                          placeholder="Enter feedback for this answer"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <ButtonGroup>
                        <Button
                          onClick={() => handleSaveGrade(answer.questionId)}
                          disabled={gradeMutation.isPending}
                        >
                          {gradeMutation.isPending ? 'Saving...' : 'Save Grade'}
                        </Button>
                      </ButtonGroup>
                    </GradingSection>
                  )}

                  {answer.score !== undefined && (
                    <AnswerSection>
                      <AnswerLabel>Your Score</AnswerLabel>
                      <AnswerContent>
                        {answer.score} / {answer.maxScore || 10}
                      </AnswerContent>
                    </AnswerSection>
                  )}

                  {answer.feedback && (
                    <AnswerSection>
                      <AnswerLabel>Feedback</AnswerLabel>
                      <AnswerContent>{answer.feedback}</AnswerContent>
                    </AnswerSection>
                  )}
                </QuestionBlock>

                {index < submission.answers.length - 1 && <Divider />}
              </div>
            ))}
          </Card>
        )}
      </Container>
    </DashboardLayout>
  )
}
