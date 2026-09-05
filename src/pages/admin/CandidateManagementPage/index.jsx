import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import styled from 'styled-components'
import { candidateKeys, deleteCandidate, listCandidates } from '../../../api/candidates'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { Menu } from '../../../components/ui/Menu'
import { Pagination } from '../../../components/ui/Pagination'
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
  const limit = 20;
  const candidatesQuery = useQuery({
    queryKey: [...candidateKeys.all, { search, page, limit }],
    queryFn: () => listCandidates({ search, page, limit }),
  })
  const candidates = useMemo(() => candidatesQuery.data?.candidates || [], [candidatesQuery.data])
  const pagination = candidatesQuery.data?.pagination
  const total = pagination?.total ?? candidates.length
  const totalPages = pagination?.totalPages ?? 1
  const deleteMutation = useMutation({
    mutationFn: deleteCandidate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: candidateKeys.all }),
  })

  const handleDelete = async (candidateId) => {
    await deleteMutation.mutateAsync(candidateId)
  }

  const getMenuItems = (candidate) => [
    { id: 'edit', label: 'Edit', onClick: () => navigate(`/admin/candidates/${candidate._id}/edit`) },
    { isDivider: true },
    { id: 'delete', label: 'Delete', danger: true, disabled: deleteMutation.isPending, onClick: () => handleDelete(candidate._id) },
  ]

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
              <Menu trigger="⋮" items={getMenuItems(candidate)} />
            </CandidateCard>
          ))}
        </CandidateList>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          onPageChange={setPage}
          itemLabel={`candidate${total === 1 ? '' : 's'}`}
        />
      </Card>
    </DashboardLayout>
  )
}
