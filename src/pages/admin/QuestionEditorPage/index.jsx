import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createQuestion, getQuestion, normalizeQuestion, questionKeys, updateQuestion } from '../../../api/questions'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { QuestionForm } from '../../../components/QuestionForm'

export function QuestionEditorPage() {
  const navigate = useNavigate()
  const { questionId } = useParams()
  const queryClient = useQueryClient()
  const questionQuery = useQuery({
    queryKey: questionKeys.detail(questionId),
    queryFn: () => getQuestion(questionId),
    enabled: Boolean(questionId),
  })
  const saveMutation = useMutation({
    mutationFn: (values) => questionId
      ? updateQuestion({ id: questionId, ...values })
      : createQuestion(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: questionKeys.all }),
  })
  const question = questionQuery.data ? normalizeQuestion(questionQuery.data) : undefined

  const handleSave = async (values) => {
    const { id, ...payload } = values
    await saveMutation.mutateAsync({ ...payload, points: Number(payload.points), ...(questionId ? { id } : {}) })
    navigate('/admin/questions')
  }

  if (questionId && questionQuery.isLoading) return <DashboardLayout title="Edit question" role="Administrator">Loading question...</DashboardLayout>
  if (questionId && questionQuery.isError) return <DashboardLayout title="Edit question" role="Administrator"><p role="alert">{questionQuery.error.message}</p></DashboardLayout>

  return (
    <DashboardLayout title={question ? 'Edit question' : 'Add question'} role="Administrator">
      <QuestionForm
        question={question}
        onCancel={() => navigate('/admin/questions')}
        onSave={handleSave}
        isSaving={saveMutation.isPending}
        saveError={saveMutation.error?.message}
      />
    </DashboardLayout>
  )
}
