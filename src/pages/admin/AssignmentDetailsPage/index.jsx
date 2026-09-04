import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { getAssignment, assignmentKeys, listAssignmentCandidates } from '../../../api/assignments'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { Button } from '../../../components/ui/Button'
import { CommonLoader } from '../../../components/ui/CommonLoader'
import { Pill } from '../../../components/ui/Pill'
import { Menu } from '../../../components/ui/Menu'
import { TextField } from '../../../components/ui/TextField'
import { DropDown } from '../../../components/ui/DropDown'
import { Pagination } from '../../../components/ui/Pagination'

const Container = styled.div`
  display: grid;
  gap: 24px;
`

const Card = styled.section`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 2px 8px ${({ theme }) => theme.colors.shadow};
`

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
  }
`

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`

const MetadataRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
`

const Muted = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  margin: 0;
  font-size: 0.9rem;
`

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 16px;
  flex-wrap: wrap;
  @media (max-width: 640px) {
    flex-direction: column;
  }
`

const StudentsTable = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: ${({ theme }) => theme.colors.primarySoft};
  }

  th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    padding: 12px 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: ${({ theme }) => theme.colors.primarySoft};
  }
`

const StudentName = styled.div`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`

const StudentEmail = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.muted};
`

const ScoreCell = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`

const StatusBadge = styled.div`
  display: inline-block;
  text-transform: uppercase;
`

const ActionsCell = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

const EmptyState = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
`

const AssessmentInfo = styled.div`
  display: grid;
  gap: 8px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  border-radius: 8px;
  margin-bottom: 20px;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const InfoLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
`

const statusTone = {
  submitted: 'success',
  pending: 'neutral',
  in_progress: 'warning',
  graded: 'success',
}

const getStatusTone = (status) => statusTone[status] || 'neutral'

const formatDate = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'N/A'
    : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short', hour12: true })
}

export function AssignmentDetailsPage() {
  const navigate = useNavigate()
  const { assignmentId } = useParams()
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Debounce search input (500ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Fetch assignment details
  const assignmentQuery = useQuery({
    queryKey: assignmentKeys.detail(assignmentId),
    queryFn: () => getAssignment(assignmentId),
  })

  // Fetch candidates with pagination, search, and status from API
  const candidatesQuery = useQuery({
    queryKey: assignmentKeys.candidatesWithParams(assignmentId, { page: currentPage, search: debouncedSearch, status: statusFilter }),
    queryFn: () => listAssignmentCandidates(assignmentId, {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      status: statusFilter === 'all' ? '' : statusFilter,
    }),
  })

  if (assignmentQuery.isLoading) {
    return (
      <DashboardLayout title="Assignment details" role="Administrator">
        <CommonLoader label="Loading assignment details..." />
      </DashboardLayout>
    )
  }

  if (assignmentQuery.isError) {
    return (
      <DashboardLayout title="Assignment details" role="Administrator">
        <Muted role="alert">{assignmentQuery.error.message}</Muted>
      </DashboardLayout>
    )
  }

  const assignment = assignmentQuery.data.assignment;
  const assessment = assignment?.assessmentId || assignment?.assessment || {}
  const displayedCandidates = candidatesQuery.data?.candidates || []

  const getMenuItems = (candidate) => [
    {
      id: 'view',
      label: 'View Response',
      onClick: () => {
        navigate(`/admin/submissions/${candidate.submissionId}`)
      },
    },
    {
      id: 'grade',
      label: 'Grade Response',
      onClick: () => {
        navigate(`/admin/submissions/${candidate.submissionId}/grade`)
      },
    },
  ]

  return (
    <DashboardLayout title="Assignment details" role="Administrator">
      <Container>
        <Card>
          <Header>
            <HeaderContent>
              <div>
                <h2>{assessment.title || assignment.assessmentTitle || 'Untitled Assignment'}</h2>
                <MetadataRow>
                  <Pill tone={assignment.status === 'active' ? 'success' : 'neutral'}>
                    {assignment.status || 'active'}
                  </Pill>
                </MetadataRow>
              </div>
            </HeaderContent>
            <HeaderActions>
              <Button
                variant="secondary"
                onClick={() => navigate(`/admin/assessments/${assessment._id || assessment.id}`)}
              >
                View Assessment
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/admin/assignments/${assignmentId}/edit`)}
              >
                Edit
              </Button>
            </HeaderActions>
          </Header>

          <AssessmentInfo>
            <InfoRow>
              <div>
                <InfoLabel>Duration:</InfoLabel>
                <InfoValue>{assignment.durationMinutes || 0} minutes</InfoValue>
              </div>
              <div>
                <InfoLabel>Total Points:</InfoLabel>
                <InfoValue>{assessment.totalPoints || 0} points</InfoValue>
              </div>
              <div>
                <InfoLabel>Questions:</InfoLabel>
                <InfoValue>{assessment.questionIds?.length || 0}</InfoValue>
              </div>
              <div>
                <InfoLabel>Expires:</InfoLabel>
                <InfoValue>{formatDate(assignment.expiresAt)}</InfoValue>
              </div>
            </InfoRow>
          </AssessmentInfo>

          {assignment.description && (
            <div>
              <strong>Description</strong>
              <Muted>{assignment.description}</Muted>
            </div>
          )}
        </Card>

        <Card>
          <h3 style={{ marginTop: 0 }}>
            Student Submissions ({candidatesQuery.data?.total || 0})
          </h3>

          <Toolbar>
            <TextField
              id="student-search"
              placeholder="Search by name or email"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
              }}
              style={{ flex: 1, minWidth: 200 }}
            />
            <DropDown
              id="submission-status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
              }}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'pending', label: 'Pending' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'submitted', label: 'Submitted' },
                { value: 'graded', label: 'Graded' },
              ]}
            />
          </Toolbar>

          {candidatesQuery.isLoading && (
            <CommonLoader label="Loading candidates..." />
          )}

          {candidatesQuery.isError && (
            <EmptyState role="alert">{candidatesQuery.error.message}</EmptyState>
          )}

          {!candidatesQuery.isLoading && !candidatesQuery.isError && displayedCandidates.length === 0 && (
            <EmptyState>
              {(candidatesQuery.data?.candidates?.length || 0) === 0
                ? 'No students assigned to this assessment yet.'
                : 'No students match your filters.'}
            </EmptyState>
          )}

          {!candidatesQuery.isLoading && !candidatesQuery.isError && displayedCandidates.length > 0 && (
            <>
              <StudentsTable>
                <Table>
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Status</th>
                      <th>Score</th>
                      <th>Submitted At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedCandidates.map((candidate) => (
                      <tr key={candidate.submissionId}>
                        <td>
                          <StudentName>{candidate.fullName}</StudentName>
                          <StudentEmail>{candidate.email}</StudentEmail>
                        </td>
                        <td>
                          <StatusBadge>
                            <Pill tone={getStatusTone(candidate.status)}>{candidate.status}</Pill>
                          </StatusBadge>
                        </td>
                        <td>
                          {candidate.isFullyScored && candidate.score !== undefined ? (
                            <ScoreCell>
                              {candidate.score ?? '-'} / {assessment.totalPoints || 0}
                            </ScoreCell>
                          ) : (
                            <Muted>Not graded</Muted>
                          )}
                        </td>
                        <td>
                          <Muted>
                            {candidate.submittedAt ? formatDate(candidate.submittedAt) : 'Not submitted'}
                          </Muted>
                        </td>
                        <td>
                          <ActionsCell>
                            <Menu trigger="⋮" items={getMenuItems(candidate)} />
                          </ActionsCell>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </StudentsTable>

              {(candidatesQuery.data?.totalPages || 1) > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={candidatesQuery.data?.totalPages || 1}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </Card>
      </Container>
    </DashboardLayout>
  )
}
