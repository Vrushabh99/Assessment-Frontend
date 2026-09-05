import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import { assessmentKeys, deleteAssessment, listAssessments } from '../../../api/assessments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { Menu } from '../../../components/ui/Menu'
import { Pagination } from '../../../components/ui/Pagination'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { DropDown } from '../../../components/ui/DropDown'
import { TextField } from '../../../components/ui/TextField'

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  @media (max-width: 640px) { flex-direction: column; }
`
const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`
const Card = styled.section`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 640px) { flex-direction: column; }
`
const AssessmentList = styled.div`display: grid; gap: 12px; padding: 20px;`
const AssessmentCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  @media (max-width: 640px) { align-items: flex-start; }
`
const AssessmentTitle = styled.h3`margin: 0 0 8px;`
const CardActions = styled.div`position: relative; display: flex; align-items: center; gap: 12px;`
const Metadata = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`
const EmptyState = styled.p`padding: 28px 20px; color: ${({ theme }) => theme.colors.muted}; text-align: center;`

const statusTone = { draft: 'warning', published: 'success', archived: 'neutral' }

export function AssessmentManagementPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 20
  const assessmentsQuery = useQuery({
    queryKey: [...assessmentKeys.all, { search, status, page, limit }],
    queryFn: () => listAssessments({ page, limit, search, status: status === 'all' ? '' : status }),
  })
  const assessments = useMemo(() => assessmentsQuery.data?.assessments || [], [assessmentsQuery.data])
  const deleteMutation = useMutation({
    mutationFn: deleteAssessment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assessmentKeys.all }),
  })

  const handleDelete = async (assessmentId) => {
    await deleteMutation.mutateAsync(assessmentId)
  }

  const getMenuItems = (assessment) => [
    { id: 'edit', label: 'Edit', onClick: () => navigate(`/admin/assessments/${assessment._id}/edit`) },
    { id: 'view', label: 'View', onClick: () => navigate(`/admin/assessments/${assessment._id}`) },
    { id: 'assign', label: 'Assign', disabled: assessment.status !== 'published', onClick: () => navigate(`/admin/assessments/${assessment._id}/assign`) },
    { isDivider: true },
    { id: 'delete', label: 'Delete', danger: true, disabled: deleteMutation.isPending, onClick: () => handleDelete(assessment._id) },
  ]

  return (
    <DashboardLayout title="Manage assessments" role="Administrator">
      <Header>
        <div>
          <h2>Assessment catalog</h2>
          <Muted>Create, organize, and publish assessments from your question bank.</Muted>
        </div>
        <Button type="button" onClick={() => navigate('/admin/assessments/new')}>+ Create assessment</Button>
      </Header>
      <Card>
        <Toolbar>
          <TextField id="assessment-search" aria-label="Search assessments" placeholder="Search assessments" value={search} onChange={(event) => setSearch(event.target.value)} />
          <DropDown id="assessment-status-filter" aria-label="Filter assessments by status" value={status} onChange={(event) => setStatus(event.target.value)} options={[{ value: 'all', label: 'All statuses' }, { value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }, { value: 'archived', label: 'Archived' }]} />
        </Toolbar>
        {assessmentsQuery.isLoading && <CommonLoader label="Loading assessments..." />}
        {assessmentsQuery.isError && <EmptyState role="alert">{assessmentsQuery.error.message}</EmptyState>}
        {!assessmentsQuery.isLoading && !assessmentsQuery.isError && assessments.length === 0 && <EmptyState>No assessments match your filters.</EmptyState>}
        <AssessmentList>
          {assessments.map((assessment) => (
            <AssessmentCard key={assessment._id}>
              <div>
                <AssessmentTitle>{assessment.title}</AssessmentTitle>
                <Metadata>
                  <span>{assessment.questionIds?.length || 0} questions</span>
                  <span>•</span>
                  <span>{assessment.totalPoints || 0} points</span>
                  <Pill tone={statusTone[assessment.status] || 'neutral'}>{assessment.status}</Pill>
                </Metadata>
              </div>
              <CardActions>
               <Menu trigger="⋮" items={getMenuItems(assessment)} />
              </CardActions>
            </AssessmentCard>
          ))}
        </AssessmentList>
        <Pagination
          currentPage={page}
          totalPages={assessmentsQuery.data?.pagination?.totalPages || 1}
          totalItems={assessmentsQuery.data?.pagination?.total}
          onPageChange={setPage}
          itemLabel="assessments"
        />
      </Card>
    </DashboardLayout>
  )
}
