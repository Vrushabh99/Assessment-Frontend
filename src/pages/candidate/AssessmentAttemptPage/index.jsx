import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAssessment, assessmentKeys } from '../../../api/assessments'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { QuestionRenderer } from '../../../components/QuestionRenderer'
import { QUESTION_RENDERER_MODES } from '../../../components/QuestionRenderer/constants'

const Card = styled.section`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`
const QuestionList = styled.div`display: grid; gap: 16px;`

const demoQuestions = [
  {
    id: 'demo-single',
    questionText: 'Which HTTP method is typically used to create a resource?',
    type: 'single-choice',
    points: 1,
    additionalInfo: { options: ['GET', 'POST', 'DELETE'], correctAnswers: [1] },
  },
  {
    id: 'demo-multiple',
    questionText: 'Which are frontend technologies?',
    type: 'multiple-choice',
    points: 2,
    additionalInfo: { options: ['React', 'MongoDB', 'CSS'], correctAnswers: [0, 2] },
  },
  {
    id: 'demo-short',
    questionText: 'In one sentence, what does JWT stand for?',
    type: 'short-answer',
    points: 1,
    additionalInfo: { expectedAnswer: 'JSON Web Token' },
  },
]

export function AssessmentAttemptPage() {
  const { assessmentId } = useParams()
  const isDemo = assessmentId === 'demo'
  const query = useQuery({
    queryKey: assessmentKeys.detail(assessmentId),
    queryFn: () => getAssessment(assessmentId),
    enabled: !isDemo,
  })
  const assessment = isDemo ? { title: 'Demo assessment', questionIds: demoQuestions } : query.data
  const [answers, setAnswers] = useState({})

  return (
    <DashboardLayout title="Assessment attempt" role="Candidate">
      <Card>
        {query.isLoading && <CommonLoader label="Loading assessment..." />}
        {query.isError && <p role="alert">{query.error.message}</p>}
        {assessment && (
          <>
            <h2>{assessment.title}</h2>
            <p>Answer each question below. Your answers are kept locally for this demo.</p>
            <QuestionList>
              {assessment.questionIds.map((question) => (
                <QuestionRenderer
                  key={question.id || question._id}
                  question={question}
                  mode={isDemo ? QUESTION_RENDERER_MODES.DEMO : QUESTION_RENDERER_MODES.ASSESSMENT}
                  answer={answers[question.id || question._id]}
                  onAnswer={(answer) => setAnswers((current) => ({ ...current, [question.id || question._id]: answer }))}
                />
              ))}
            </QuestionList>
          </>
        )}
      </Card>
    </DashboardLayout>
  )
}
