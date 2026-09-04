import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem, Pagination } from '@mui/material'
import styled from 'styled-components'
import { candidateKeys, deleteCandidate, listCandidates } from '../../../api/candidates'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { CommonLoader } from '../../../components/ui/CommonLoader'
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
const Toolbar = styled.div`padding: 20px; border-bottom: 1px solid ${({ theme }) => theme.colors.border};`
const CandidateList = styled.div`display: grid; gap: 12px; padding: 20px;`
const CandidateCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
`
const CandidateName = styled.h3`margin: 0 0 6px;`
const EmptyState = styled.p`padding: 28px 20px; color: ${({ theme }) => theme.colors.muted}; text-align: center;`

export function CandidateManagementPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [actionAnchor, setActionAnchor] = useState(null)
  const [activeCandidate, setActiveCandidate] = useState(null)
  const candidatesQuery = useQuery({
    queryKey: [...candidateKeys.all, { search, page }],
    queryFn: () => listCandidates({ search, page }),
  })
  const candidates = useMemo(() => candidatesQuery.data?.candidates || [], [candidatesQuery.data])
  const pagination = candidatesQuery.data?.pagination
  const total = pagination?.total ?? candidates.length
  const totalPages = pagination?.totalPages ?? 1
  const deleteMutation = useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: candidateKeys.all }),
  })

  const openActions = (event, candidate) => {
    setActionAnchor(event.currentTarget)
    setActiveCandidate(candidate)
  }
  const closeActions = () => {
    setActionAnchor(null)
    setActiveCandidate(null)
  }
  const handleDelete = async () => {
    if (!activeCandidate) return
    await deleteMutation.mutateAsync(activeCandidate._id)
    closeActions()
  }

  return (
    <DashboardLayout title="Manage candidates" role="Administrator">
      <Header>
        <div>
          <h2>Candidate directory</h2>
          <Muted>Create and manage candidate accounts for assessments.</Muted>
        </div>
        <Button type="button" onClick={() => navigate('/admin/candidates/new')}>+ Create candidate</Button>
      </Header>
      <Card>
        <Toolbar>
          <TextField
            id="candidate-search"
            aria-label="Search candidates"
            placeholder="Search by name or email"
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1) }}
          />
        </Toolbar>
        {candidatesQuery.isLoading && <CommonLoader label="Loading candidates..." />}
        {candidatesQuery.isError && <EmptyState role="alert">{candidatesQuery.error.message}</EmptyState>}
        {!candidatesQuery.isLoading && !candidatesQuery.isError && !candidates.length && <EmptyState>No candidates found.</EmptyState>}
        <CandidateList>
          {candidates.map((candidate) => (
            <CandidateCard key={candidate._id}>
              <div>
                <CandidateName>{candidate.firstName} {candidate.lastName}</CandidateName>
                <Muted>{candidate.email}</Muted>
              </div>
              <IconButton
                aria-label={`Actions for ${candidate.firstName} ${candidate.lastName}`}
                aria-controls={activeCandidate?._id === candidate._id ? 'candidate-actions' : undefined}
                aria-haspopup="true"
                onClick={(event) => openActions(event, candidate)}
              >
                <MoreVertIcon />
              </IconButton>
            </CandidateCard>
          ))}
        </CandidateList>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, nextPage) => setPage(nextPage)}
            sx={{ display: 'flex', justifyContent: 'center', py: 2 }}
          />
        )}
      </Card>
      <Muted>{total} candidate{total === 1 ? '' : 's'}</Muted>
      <Menu
        id="candidate-actions"
        anchorEl={actionAnchor}
        open={Boolean(actionAnchor)}
        onClose={closeActions}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { closeActions(); navigate(`/admin/candidates/${activeCandidate?._id}/edit`) }}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} disabled={deleteMutation.isPending} sx={{ color: 'error.main' }}>
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </MenuItem>
      </Menu>
    </DashboardLayout>
  )
}
