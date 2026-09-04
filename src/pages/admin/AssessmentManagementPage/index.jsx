import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem } from '@mui/material'
import styled from 'styled-components'
import { assessmentKeys, deleteAssessment, listAssessments } from '../../../api/assessments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
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
const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`
const StatCard = styled.article`
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.surface};
`
const StatLabel = styled.span`color: ${({ theme }) => theme.colors.muted};`
const StatValue = styled.strong`display: block; margin-top: 6px; font-size: 1.75rem;`
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
  @media (max-width: 640px) { align-items: flex-start; flex-direction: column; }
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
  const [actionAnchor, setActionAnchor] = useState(null)
  const [activeAssessment, setActiveAssessment] = useState(null)
  const assessmentsQuery = useQuery({
    queryKey: [...assessmentKeys.all, { search, status }],
    queryFn: () => listAssessments({ page: 1, limit: 20, search, status: status === 'all' ? '' : status }),
  })
  const assessments = useMemo(() => assessmentsQuery.data?.assessments || [], [assessmentsQuery.data])
  const deleteMutation = useMutation({
    mutationFn: deleteAssessment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assessmentKeys.all }),
  })
  const counts = useMemo(() => ({
    total: assessments.length,
    published: assessments.filter(({ status: itemStatus }) => itemStatus === 'published').length,
    points: assessments.reduce((total, assessment) => total + Number(assessment.totalPoints || 0), 0),
  }), [assessments])

  const openActions = (event, assessment) => {
    setActionAnchor(event.currentTarget)
    setActiveAssessment(assessment)
  }
  const closeActions = () => {
    setActionAnchor(null)
    setActiveAssessment(null)
  }
  const handleDelete = async () => {
    if (!activeAssessment) return
    await deleteMutation.mutateAsync(activeAssessment._id)
    closeActions()
  }

  return (
    <DashboardLayout title="Manage assessments" role="Administrator">
      <Header>
        <div>
          <h2>Assessment catalog</h2>
          <Muted>Create, organize, and publish assessments from your question bank.</Muted>
        </div>
        <Button type="button" onClick={() => navigate('/admin/assessments/new')}>+ Create assessment</Button>
      </Header>
      <Stats>
        <StatCard><StatLabel>Assessments</StatLabel><StatValue>{counts.total}</StatValue></StatCard>
        <StatCard><StatLabel>Published</StatLabel><StatValue>{counts.published}</StatValue></StatCard>
        <StatCard><StatLabel>Total points</StatLabel><StatValue>{counts.points}</StatValue></StatCard>
      </Stats>
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
                <Pill tone="info">Assessment</Pill>
                <IconButton
                  aria-label={`Actions for ${assessment.title}`}
                  aria-controls={activeAssessment?._id === assessment._id ? 'assessment-actions' : undefined}
                  aria-haspopup="true"
                  onClick={(event) => openActions(event, assessment)}
                  size="small"
                >
                  <MoreVertIcon />
                </IconButton>
              </CardActions>
            </AssessmentCard>
          ))}
        </AssessmentList>
      </Card>
      <Menu
        id="assessment-actions"
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={closeActions}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { closeActions(); navigate(`/admin/assessments/${activeAssessment?._id}/edit`) }}>Edit</MenuItem>
        <MenuItem onClick={() => { closeActions(); navigate(`/admin/assessments/${activeAssessment?._id}`) }}>View</MenuItem>
        <MenuItem onClick={() => { closeActions(); navigate(`/admin/assessments/${activeAssessment?._id}/assign`) }}>Assign</MenuItem>
        <MenuItem onClick={handleDelete} disabled={deleteMutation.isPending} sx={{ color: 'error.main' }}>
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </MenuItem>
      </Menu>
    </DashboardLayout>
  )
}
