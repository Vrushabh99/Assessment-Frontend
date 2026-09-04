import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem } from '@mui/material'
import styled from 'styled-components'
import { assignmentKeys, deleteAssignment, listAssignments } from '../../../api/assignments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { DropDown } from '../../../components/ui/DropDown'
import { TextField } from '../../../components/ui/TextField'

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
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
const AssignmentList = styled.div`display: grid; gap: 12px; padding: 20px;`
const AssignmentCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  @media (max-width: 640px) { align-items: flex-start; flex-direction: column; }
`
const AssignmentContent = styled.div`display: grid; gap: 10px; min-width: 0;`
const CardActions = styled.div`display: flex; align-items: center; gap: 8px;`
const AssignmentTitleRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
`
const AssignmentTitle = styled.h3`margin: 0;`
const AssignmentDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const Metadata = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`
const EmptyState = styled.p`padding: 28px 20px; color: ${({ theme }) => theme.colors.muted}; text-align: center;`
const statusTone = { active: 'success', cancelled: 'neutral' }

const getAssignments = (data) => data?.assignments || data?.items || []

const formatDate = (value) => {
  if (!value) return 'No expiry'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'No expiry'
    : `Expires ${date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', hour12: true })}`
}

export function AssignmentManagementPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [actionAnchor, setActionAnchor] = useState(null)
  const [activeAssignment, setActiveAssignment] = useState(null)
  const query = useQuery({
    queryKey: [...assignmentKeys.all, { search, status }],
    queryFn: () => listAssignments({ status: status === 'all' ? '' : status }),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
  })
  const assignments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return getAssignments(query.data).filter((assignment) => {
      if (!normalizedSearch) return true
      const assessment = assignment.assessmentId || assignment.assessment || {}
      const title = assessment.title || assignment.assessmentTitle || ''
      return title.toLowerCase().includes(normalizedSearch)
    })
  }, [query.data, search])
  const counts = useMemo(() => ({
    total: assignments.length,
    active: assignments.filter((item) => item.status === 'active').length,
    submitted: assignments.filter((item) => item.status === 'cancelled').length,
  }), [assignments])
  const closeActions = () => {
    setActionAnchor(null)
    setActiveAssignment(null)
  }
  const getAssessmentId = (assignment) => {
    const assessment = assignment?.assessmentId || assignment?.assessment
    return assessment?._id || assessment?.id || assignment?.assessmentId
  }
  const handleDelete = async () => {
    if (!activeAssignment) return
    await deleteMutation.mutateAsync(activeAssignment._id || activeAssignment.id)
    closeActions()
  }

  return (
    <DashboardLayout title="Assignment management" role="Administrator">
      <Header>
        <div>
          <h2>Assignment listing</h2>
          <Muted>Track assessment access, progress, and submission status.</Muted>
        </div>
      </Header>
      <Card>
        <Toolbar>
          <TextField id="assignment-search" aria-label="Search assignments" placeholder="Search candidates or assessments" value={search} onChange={(event) => setSearch(event.target.value)} />
          <DropDown id="assignment-status-filter" aria-label="Filter assignments by status" value={status} onChange={(event) => setStatus(event.target.value)} options={[{ value: 'all', label: 'All statuses' }, { value: 'active', label: 'Active' }, { value: 'cancelled', label: 'Cancelled' }]} />
        </Toolbar>
        {query.isLoading && <CommonLoader label="Loading assignments..." />}
        {query.isError && <EmptyState role="alert">{query.error.message}</EmptyState>}
        {!query.isLoading && !query.isError && !assignments.length && <EmptyState>No assignments match your filters.</EmptyState>}
        <AssignmentList>
          {assignments.map((assignment) => {
            const assessment = assignment.assessmentId || assignment.assessment || {}
            const totalPoints = assessment.totalPoints ?? assignment.totalPoints ?? '-'
            return (
              <AssignmentCard key={assignment._id || assignment.id}>
                <AssignmentContent>
                  <AssignmentTitleRow>
                    <AssignmentTitle>{assessment.title || assignment.assessmentTitle || 'Untitled assessment'}</AssignmentTitle>
                    <Pill tone={statusTone[assignment.status] || 'neutral'}>{assignment.status || 'active'}</Pill>
                  </AssignmentTitleRow>
                  {assignment.description && <AssignmentDescription>{assignment.description}</AssignmentDescription>}
                  <Metadata>
                    <Pill tone="neutral">{assignment.studentCount ?? 0} students</Pill>
                    <Pill tone="neutral">{assignment.durationMinutes || 0} minutes</Pill>
                    <Pill tone="neutral">{formatDate(assignment.expiresAt)}</Pill>
                    <Pill tone="neutral">Score: {assignment.score ?? totalPoints}</Pill>
                  </Metadata>
                </AssignmentContent>
                <CardActions>
                  <IconButton
                    size="small"
                    aria-label={`Actions for ${assessment.title || 'assignment'}`}
                    onClick={(event) => { setActionAnchor(event.currentTarget); setActiveAssignment(assignment) }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </CardActions>
              </AssignmentCard>
            )
          })}
        </AssignmentList>
      </Card>
      <Muted>{counts.total} total • {counts.active} active • {counts.submitted} submitted</Muted>
      <Menu
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={closeActions}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { const id = getAssessmentId(activeAssignment); closeActions(); if (id) navigate(`/admin/assessments/${id}`) }}>View</MenuItem>
        <MenuItem onClick={() => { closeActions(); navigate(`/admin/assignments/${activeAssignment?._id || activeAssignment?.id}/edit`) }}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} disabled={deleteMutation.isPending} sx={{ color: 'error.main' }}>
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </MenuItem>
      </Menu>
    </DashboardLayout>
  )
}
