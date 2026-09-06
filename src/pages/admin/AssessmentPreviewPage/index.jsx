import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import { getAssessment, assessmentKeys } from '../../../api/assessments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { QuestionRenderer } from '../../../components/QuestionRenderer'
import { QUESTION_RENDERER_MODES } from '../../../components/QuestionRenderer/constants'
import { AssessmentHeader, HeaderActions, HeaderContent } from './styles'
import { Timer } from '../../../components/ui/Timer'
import { ToggleButton } from '@mui/material'
import { CheckBox } from '@mui/icons-material'
import { useState } from 'react'
import { ToggleSwitch } from '../../../components/ui/ToggleSwitch'

const Card = styled.section`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`
const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`
const Meta = styled.div`display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 16px 0 24px;`
const QuestionList = styled.div`display: grid; gap: 16px;`

export function AssessmentPreviewPage() {
  const { assessmentId } = useParams()
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const query = useQuery({ queryKey: assessmentKeys.detail(assessmentId), queryFn: () => getAssessment(assessmentId) })
  if (query.isLoading) return <DashboardLayout title="Assessment details" role="Administrator"><CommonLoader label="Loading assessment..." /></DashboardLayout>
  if (query.isError) return <DashboardLayout title="Assessment details" role="Administrator"><Muted role="alert">{query.error.message}</Muted></DashboardLayout>
  const assessment = query.data
  return (
    <DashboardLayout title="Assessment details" role="Administrator" hideNavigation>
      <Card>
        <AssessmentHeader>
          <HeaderContent>
            <Pill tone="warning">Preview for admin</Pill>
            <h2>{assessment.title}</h2>
          </HeaderContent>
          
            <HeaderActions>
          <Timer minutes={20} active onExpire={() => {}} />
          <Button type="button" variant="primary" onClick={() => {}}>Submit</Button>
          </HeaderActions>
        </AssessmentHeader>
        <Meta>
          <Muted>{assessment.questionIds.length} questions</Muted>
          <Muted>{assessment.totalPoints} total points</Muted>
        </Meta>
        <Meta>
          <ToggleSwitch
            id="show-correct-answer"
            checked={showCorrectAnswer}
            onChange={setShowCorrectAnswer}
            label="Show correct answers"
          />
        </Meta>
        <QuestionList>
          {assessment.questionIds.map((question) => (
            <QuestionRenderer
              key={question._id || question.id}
              question={question}
              mode={QUESTION_RENDERER_MODES.PREVIEW}
              showCorrectAnswer={showCorrectAnswer}
            />
          ))}
        </QuestionList>
      </Card>
    </DashboardLayout>
  )
}
