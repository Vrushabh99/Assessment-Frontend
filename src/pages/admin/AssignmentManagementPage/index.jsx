import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import { assignmentKeys, deleteAssignment, listAssignments, cancelAssignment } from '../../../api/assignments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Menu } from '../../../components/ui/Menu'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { DropDown } from '../../../components/ui/DropDown'
import { TextField } from '../../../components/ui/TextField'
import { Pagination } from '../../../components/ui/Pagination'
import { formatDate, formatMinutes, isOlderTime } from '../../../utils/helpers'
import { useDebounce } from '../../../hooks/useDebounced'

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
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
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 640px) { flex-direction: column; padding: 16px 10px; }
`
const AssignmentList = styled.div`
  display: grid;
  gap: 12px;
  padding: 16px;
  @media (max-width: 640px) { padding: 16px 10px; }
  @media (max-width: 400px) {
    padding: 10px 8px;
  }
`
const AssignmentCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  @media (max-width: 640px) { align-items: flex-start; padding: 18px 10px; flex-direction: column}
`
const AssignmentContent = styled.div`display: grid; gap: 10px; min-width: 0;`
const CardActions = styled.div`display: flex; align-items: center; gap: 8px; margin-left: auto`
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
const statusTone = {
  active: 'success',
  cancelled: 'warning',
  expired: 'warning',
}


export function AssignmentManagementPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const limit = 20

  const debouncedSearch = useDebounce(search);

  useEffect(() => setPage(1), [debouncedSearch]);

  const query = useQuery({
    queryKey: [...assignmentKeys.all, { search: debouncedSearch, status, page, limit }],
    queryFn: () => listAssignments({ search: debouncedSearch, page, limit, status: status === 'all' ? '' : status }),
  })
  const deleteMutation = useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
  })
  const cancelMutation = useMutation({
    mutationFn: cancelAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
  })

  const assignments = query?.data?.assignments || [];

  const getAssessmentId = (assignment) => {
    const assessment = assignment?.assessmentId || assignment?.assessment
    return assessment?._id || assessment?.id || assignment?.assessmentId
  }

  const handleDelete = async (assignmentId) => {
    await deleteMutation.mutateAsync(assignmentId)
  }

  const handleCancel = async (assignmentId) => {
    await cancelMutation.mutateAsync(assignmentId)
  }

  const getMenuItems = (assignment) => {
    const assessmentId = getAssessmentId(assignment)
    return [
      { id: 'details', label: 'View Submissions', onClick: () => navigate(`/admin/assignments/${assignment._id || assignment.id}`) },
      { id: 'edit', label: 'Edit / Assign', onClick: () => navigate(`/admin/assessments/${assessmentId}/assign?edit`) },
      { id: 'preview', label: 'Preview', onClick: () => { assessmentId && 
        window.open(`/admin/assessments/${assessmentId}/preview`, '_blank', 'noopener,noreferrer')    
      }},
      { isDivider: true },
      { id: 'delete', label: 'Delete', danger: true, disabled: deleteMutation.isPending, onClick: () => handleDelete(assignment._id || assignment.id) },
    ]
  }

  const pagination = query.data?.pagination
  const total = pagination?.total ?? query.length
  const totalPages = pagination?.totalPages ?? 1
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
          <TextField id="assignment-search" aria-label="Search assignments" placeholder="Search assessments" value={search} onChange={(event) => setSearch(event.target.value)} style={{'width': 270}}/>
          <DropDown
            id="assignment-status-filter"
            aria-label="Filter assignments by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[{
              value: 'all',
              label: 'All statuses' 
            },
            {
              value: 'active',
              label: 'Active'
            },
            {
              value: 'expired',
              label: 'Expired'
            }]}
            style={{'width': 200}}
          />
        </Toolbar>
        {query.isLoading && <CommonLoader label="Loading assignments..." />}
        {query.isError && <EmptyState role="alert">{query.error.message}</EmptyState>}
        {!query.isLoading && !query.isError && !assignments.length && <EmptyState>No assignments match your filters.</EmptyState>}
        <AssignmentList>
          {assignments.map((assignment) => {
            const assessment = assignment.assessmentId || assignment.assessment || {}
            const totalPoints = assessment.totalPoints ?? assignment.totalPoints ?? '-'
            const expiresAt = formatDate(assignment.expiresAt);
            const isExpired = isOlderTime(assignment.expiresAt);
            return (
              <AssignmentCard key={assignment._id || assignment.id}>
                <AssignmentContent>
                  <AssignmentTitleRow>
                    <AssignmentTitle>{assessment.title || assignment.assessmentTitle || 'Untitled assessment'}</AssignmentTitle>
                    <Pill tone={statusTone[isExpired ? 'expired' : assignment.status] || 'neutral'}>{isExpired ? 'expired' : 'active'}</Pill>
                  </AssignmentTitleRow>
                  {assignment.description && <AssignmentDescription>{assignment.description}</AssignmentDescription>}
                  <Metadata>
                    <Pill tone="info">{assignment.studentCount ?? 0} students</Pill>
                    <Pill tone="warning">Duration: {formatMinutes(assignment.durationMinutes)}</Pill>
                    {expiresAt !== '-' && (<Pill tone="neutral">Expires at: {expiresAt}</Pill>)}
                    <Pill tone="info">Max Score: {totalPoints}</Pill>
                  </Metadata>
                </AssignmentContent>
                <CardActions>
                  <Menu trigger="⋮" items={getMenuItems(assignment)} />
                </CardActions>
              </AssignmentCard>
            )
          })}
        </AssignmentList>
      </Card>
      <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                onPageChange={setPage}
                itemLabel={`Assignment${total === 1 ? '' : 's'}`}
              />
    </DashboardLayout>
  )
}
