import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { QuestionForm } from '../../../components/QuestionForm'

export function QuestionEditorPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { questionId } = useParams()
  const question = state?.question || (questionId ? {
    id: questionId,
    title: '',
    type: 'Single choice',
    difficulty: 'Easy',
    status: 'Draft',
    additionalInfo: { options: ['', ''], correctAnswers: [] },
  } : undefined)

  const handleSave = (question) => {
    navigate('/admin/questions', { state: { savedQuestion: { ...question, id: question.id || `Q-${Date.now()}`, usage: question.usage || 0 } } })
  }

  return (
    <DashboardLayout title={question ? 'Edit question' : 'Add question'} role="Administrator">
      <QuestionForm
        question={question}
        onCancel={() => navigate('/admin/questions')}
        onSave={handleSave}
      />
    </DashboardLayout>
  )
}
