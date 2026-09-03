import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listQuestions, normalizeQuestion, questionKeys } from '../../../api/questions'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { AssessmentForm } from '../../../components/AssessmentForm'

export function AssessmentEditorPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 1
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

  const handleSave = async (assessment) => {
    navigate('/admin/assessments', { state: { savedAssessment: assessment } })
  }

  return (
    <DashboardLayout title="Create assessment" role="Administrator">
      <AssessmentForm
        questions={questions}
        isLoading={questionsQuery.isLoading}
        loadError={questionsQuery.error?.message}
        onCancel={() => navigate('/admin/assessments')}
        onSave={handleSave}
        search={search}
        onSearch={setSearch}
        page={page}
        totalPages={questionsQuery.data?.totalPages || 1}
        onPageChange={setPage}
      />
    </DashboardLayout>
  )
}
