import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import { AssessmentKeys, deleteAssessment, listAssessments } from '../../../api/assessments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { Menu } from '../../../components/ui/Menu'
import { Pagination } from '../../../components/ui/Pagination'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { DropDown } from '../../../components/ui/DropDown'
import { TextField } from '../../../components/ui/TextField'
import { useDebounce } from '../../../hooks/useDebounced'
import { Add as AddIcon, AutoAwesome as AutoAwesomeIcon } from '@mui/icons-material';
import { Alert, Snackbar } from '@mui/material'

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  @media (max-width: 640px) { flex-direction: column; }
`
const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  @media (max-width: 640px) { flex-direction: column; }
`;

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
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 640px) { flex-direction: column; padding: 16px 10px; }
`
const AssessmentList = styled.div`
  display: grid;
  gap: 12px;
  padding: 16px;
  @media (max-width: 640px) { padding: 16px 10px; }
  @media (max-width: 400px) {
    padding: 10px 8px;
  }
`
const AssessmentCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  @media (max-width: 640px) { align-items: flex-start; padding: 18px 10px; flex-direction: column}
`
const AssessmentTitle = styled.h3`margin: 0 0 8px;`
const CardActions = styled.div`position: relative; display: flex; align-items: center; gap: 12px; margin-left: auto`
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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info'})
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 20

  const debouncedSearch = useDebounce(search);

  useEffect(() => setPage(1), [debouncedSearch]);

  const getParams = () => {
    return {
      page: page || 1,
      limit: limit || 20,
      search: debouncedSearch || '',
      status: status === 'all' ? '' : status,
    }
  }
  const assessmentsQuery = useQuery({
    queryKey: AssessmentKeys.all(getParams()),
    queryFn: () => listAssessments(getParams()),
  })

  const assessments = useMemo(() => assessmentsQuery.data?.assessments || [], [assessmentsQuery.data])
  const deleteMutation = useMutation({
    mutationFn: deleteAssessment,
    onSuccess: () => {
      setSnackbar({ open: true, message: 'Assessment deleted successfully', severity: 'success' })
      queryClient.invalidateQueries({ queryKey: AssessmentKeys.prefix })
    },
    onError: (error) => {
      setSnackbar({ open: true, message: error.message || 'An error occurred', severity: 'error' })
    }
  })

  const handleDelete = async (assessmentId, deleteQuestions = false) => {
    await deleteMutation.mutateAsync({ id: assessmentId, deleteQuestions })
  }

  const getMenuItems = (assessment) => [
    { id: 'edit', label: 'Edit', onClick: () => navigate(`/admin/assessments/${assessment._id}/edit`) },
    {
      id: 'view', label: 'Preview', onClick: () => {
        window.open(`/admin/assessments/${assessment._id}/preview`, '_blank', 'noopener,noreferrer')
      }
    },
    { id: 'assign', label: 'Assign', disabled: assessment.status !== 'published', onClick: () => navigate(`/admin/assessments/${assessment._id}/assign`) },
    { isDivider: true },
    { id: 'delete', label: 'Delete', danger: true, disabled: deleteMutation.isPending, onClick: () => handleDelete(assessment._id, false) },
    { id: 'delete-with-questions', label: 'Delete and remove questions', danger: true, disabled: deleteMutation.isPending, onClick: () => handleDelete(assessment._id, true) },
  ]

  return (
    <DashboardLayout title="Manage assessments" role="Administrator">
      <Header>
        <div>
          <h2>Assessment catalog</h2>
          <Muted>Create, organize, and publish assessments from your question bank.</Muted>
        </div>
        <HeaderActions>
          <Button
            variant="secondary"
            startIcon={<AutoAwesomeIcon />}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, px: 2.5, backgroundColor: '#eef1ff', color: '#4055c7' }}
            onClick={() => navigate('/admin/ai-assessment')}
          >
            Generate with AI
          </Button>
          <Button
            variant="primary"
            startIcon={<AddIcon />}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, px: 2.5 }}
            onClick={() => navigate('/admin/assessments/new')}
          >
            New Assessment
          </Button>
        </HeaderActions>
      </Header>
      <Card>
        <Toolbar>
          <TextField id="assessment-search" aria-label="Search assessments" placeholder="Search assessments" value={search} onChange={(event) => setSearch(event.target.value)} style={{ 'width': 300 }} />
          <DropDown id="assessment-status-filter" aria-label="Filter assessments by status" value={status} onChange={(event) => setStatus(event.target.value)} options={[{ value: 'all', label: 'All statuses' }, { value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }, { value: 'archived', label: 'Archived' }]} style={{ 'width': 200 }} />
        </Toolbar>
        {assessmentsQuery.isLoading && <CommonLoader label="Loading assessments..." />}
        {assessmentsQuery.isError && <EmptyState role="alert">{assessmentsQuery.error.message}</EmptyState>}
        {!assessmentsQuery.isLoading && !assessmentsQuery.isError && assessments.length === 0 && <EmptyState>No assessments match your filters.</EmptyState>}
        <AssessmentList>
          {assessments.map((assessment) => (
            <AssessmentCard key={assessment._id}>
              <div>
                <AssessmentTitle>
                  {assessment.title} &nbsp;
                  {assessment.tags?.includes('AI') && <Pill tone="info"><AutoAwesomeIcon color="primary" fontSize="xs" />&nbsp;AI</Pill>}
                </AssessmentTitle>
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
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((current) => ({ ...current, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </DashboardLayout>
  )
}
