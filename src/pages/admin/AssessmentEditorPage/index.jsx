import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listQuestions, normalizeQuestion, questionKeys } from '../../../api/questions'
import { assessmentKeys, createAssessment, getAssessment, updateAssessment } from '../../../api/assessments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { AssessmentForm } from '../../../components/AssessmentForm'
import { CommonLoader } from '../../../components/ui/CommonLoader'

export function AssessmentEditorPage() {
  const navigate = useNavigate()
  const { assessmentId } = useParams()
  const queryClient = useQueryClient()
  const assessmentQuery = useQuery({
    queryKey: assessmentKeys.detail(assessmentId),
    queryFn: () => getAssessment(assessmentId),
    enabled: Boolean(assessmentId),
  })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 25
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timeout)
  }, [search])
  useEffect(() => setPage(1), [debouncedSearch])
  const questionsQuery = useQuery({
    queryKey: [...questionKeys.all, { page, limit, search: debouncedSearch }],
    queryFn: () => listQuestions({ page, limit, search: debouncedSearch }),
    placeholderData: (previousData) => previousData,
  })
  const questions = (questionsQuery.data?.items || []).map(normalizeQuestion)
  const saveMutation = useMutation({
    mutationFn: (assessment) => assessmentId
      ? updateAssessment({ id: assessmentId, ...assessment })
      : createAssessment(assessment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assessmentKeys.all }),
  })

  const handleSave = async (assessment) => {
    await saveMutation.mutateAsync(assessment)
    navigate('/admin/assessments')
  }

  if (assessmentId && assessmentQuery.isLoading) {
    return <DashboardLayout title="Edit assessment" role="Administrator"><CommonLoader label="Loading assessment..." /></DashboardLayout>
  }
  if (assessmentId && assessmentQuery.isError) {
    return <DashboardLayout title="Edit assessment" role="Administrator"><p role="alert">{assessmentQuery.error.message}</p></DashboardLayout>
  }

  return (
    <DashboardLayout title={assessmentId ? 'Edit assessment' : 'Create assessment'} role="Administrator">
      <AssessmentForm
        questions={questions}
        initialAssessment={assessmentQuery.data}
        isLoading={questionsQuery.isLoading}
        loadError={questionsQuery.error?.message}
        onCancel={() => navigate('/admin/assessments')}
        onSave={handleSave}
        saveError={saveMutation.error?.message}
        isSaving={saveMutation.isPending}
        search={search}
        onSearch={setSearch}
        page={page}
        totalPages={questionsQuery.data?.totalPages || 1}
        onPageChange={setPage}
      />
    </DashboardLayout>
  )
}
