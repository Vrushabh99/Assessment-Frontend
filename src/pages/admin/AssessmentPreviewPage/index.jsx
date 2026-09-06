import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAssessment, assessmentKeys } from '../../../api/assessments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { QuestionRenderer } from '../../../components/QuestionRenderer'
import { QUESTION_RENDERER_MODES } from '../../../components/QuestionRenderer/constants'
import { AssessmentHeader, HeaderActions, HeaderContent, Card, Meta, Muted, QuestionList } from './styles'
import { Timer } from '../../../components/ui/Timer'
import { AppBar } from '@mui/material'
import { useState } from 'react'
import { ToggleSwitch } from '../../../components/ui/ToggleSwitch'



export function AssessmentPreviewPage() {
  const { assessmentId } = useParams()
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const query = useQuery({ queryKey: assessmentKeys.detail(assessmentId), queryFn: () => getAssessment(assessmentId) })
  if (query.isLoading) return <DashboardLayout title="Assessment details" role="Administrator"><CommonLoader label="Loading assessment..." /></DashboardLayout>
  if (query.isError) return <DashboardLayout title="Assessment details" role="Administrator"><Muted role="alert">{query.error.message}</Muted></DashboardLayout>
  const assessment = query.data
  return (
    <DashboardLayout title="Assessment details" role="Administrator" hideNavigation>
        
        <AssessmentHeader>
          <HeaderContent>
          <Pill tone="warning">Preview for admin</Pill>
            <h2>{assessment.title}</h2>
          </HeaderContent>
        </AssessmentHeader>
        <AppBar position='sticky' color='tranparent' style={{width: 340, display: 'flex',justifyContent: 'flex-end', marginLeft: 'auto', background: '#ffffff', padding: '8px'}}>
        <HeaderActions>
          <Timer minutes={260} active onExpire={() => {}} />
          <Button type="button" variant="primary" onClick={() => {}}>Submit</Button>
          </HeaderActions>
        </AppBar>

          
      <Card>
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
