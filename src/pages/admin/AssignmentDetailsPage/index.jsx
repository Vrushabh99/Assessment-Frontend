import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
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
import { formatDate, formatMinutes } from '../../../utils/helpers'
import { resetCandidateAttempt } from '../../../api/submissions'
import { Alert, Snackbar } from '@mui/material'

const TABLE_BREAKPOINT = '768px'

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

// Table view — desktop/tablet only. Below TABLE_BREAKPOINT we switch to
// CandidateList (a stack of Cards) instead of horizontally scrolling a
// cramped table.
const StudentsTable = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;

  @media (max-width: ${TABLE_BREAKPOINT}) {
    display: none;
  }
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

// Card view — shown only below TABLE_BREAKPOINT, one Card per candidate.
const CandidateList = styled.div`
  display: none;
  flex-direction: column;
  gap: 12px;

  @media (max-width: ${TABLE_BREAKPOINT}) {
    display: flex;
  }
`

const CandidateCard = styled(Card)`
  padding: 16px;
  display: grid;
  gap: 12px;
`

const CandidateCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`

const CandidateCardMeta = styled.div`
  display: grid;
  gap: 6px;
`

const CandidateCardMetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.9rem;
`

const CandidateCardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
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

const ActionsWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  width: 100%;
`;


const StatusPill = ({ submission }) => {
  const { status, isFullyScored } = submission;
  let tone;
  let label;
  switch(status) {
    case 'submitted': { tone = 'success'; label = isFullyScored ? 'Graded' : 'Submitted'; break; }
    case 'assigned' : { tone = 'warning'; label = 'Not Started'; break; }
    default: tone = 'warning'; label = 'In Progress';
  }
 
  return(
    <Pill
      tone={tone}
    >
      {label}
    </Pill>
  )
}

export function AssignmentDetailsPage() {
  const navigate = useNavigate()
  const { assignmentId } = useParams()
  const [searchInput, setSearchInput] = useState('')
  const [ snackbar, setSnackbar] = useState({ open: false, message: ''})
  const [ currentCandidate, setCurrentCandidate] = useState(null);
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const queryClient = useQueryClient()
  
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


  const resetMutation = useMutation({
    mutationFn: (data) => resetCandidateAttempt(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.candidatesWithParams(assignmentId, { page: currentPage, search: debouncedSearch, status: statusFilter })})
      setSnackbar({ open: true, message: `Attempt resetted for ${currentCandidate.fullName}.`})
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Something went wrong. Try again !', severity: 'error'})
    }
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

  const handleReset = async (candidate) => {
    const { attemptId, fullName } = candidate;
    setCurrentCandidate({ fullName });
    await resetMutation.mutateAsync({ attemptId })
  }
  const getMenuItems = (candidate) => [
    {
      id: 'view',
      label: 'View Response',
      disabled: ['assigned'].includes(candidate.status),
      onClick: () => {
        navigate(`/admin/submissions/${assignment._id}/${candidate.id}`)
      },
    },
    {
      id: 'grade',
      label: 'Grade Response',
      disabled: ['assigned', 'in_progress'].includes(candidate.status),
      onClick: () => {
        navigate(`/admin/submissions/${assignment._id}/${candidate.id}/grade`)
      },
    },
    {
      id: 'reset',
      label: 'Reset Response',
      disabled: ['assigned'].includes(candidate.status),
      onClick: () => handleReset(candidate),
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
                variant='primary'
                onClick={() => navigate('/admin/assignments')}
              >
                Back
              </Button>
            </HeaderActions>
          </Header>

          <AssessmentInfo>
            <InfoRow>
              <div>
                <InfoLabel>Duration: </InfoLabel>
                <InfoValue>{formatMinutes(assignment.durationMinutes || 0)}</InfoValue>
              </div>
              <div>
                <InfoLabel>Total Points: </InfoLabel>
                <InfoValue>{assessment.totalPoints || 0} points</InfoValue>
              </div>
              <div>
                <InfoLabel>Questions: </InfoLabel>
                <InfoValue>{assessment.questionIds?.length || 0}</InfoValue>
              </div>
              <div>
                <InfoLabel>Expires: </InfoLabel>
                <InfoValue>{formatDate(assignment.expiresAt)}</InfoValue>
              </div>
              <ActionsWrapper>
                <Button
                variant="primary"
                onClick={() => {
                  window.open(`/admin/assessments/${assessment._id}/preview`, '_blank', 'noopener,noreferrer')
                }}
              >
                View Assessment
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate(`/admin/assignments/${assignmentId}/edit`)}
              >
                Edit
              </Button>
              </ActionsWrapper>
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
            Student Submissions ({candidatesQuery?.data?.pagination.total || 0})
          </h3>

          <Toolbar>
            <TextField
              id="student-search"
              placeholder="Search by name or email"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
              }}
              style={{ flex: 1, minWidth: 300 }}
            />
            <DropDown
              id="submission-status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
              }}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'assigned', label: 'Assigned' },
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
              {/* Desktop/tablet: table */}
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
                          <StatusPill
                            submission={candidate}
                          />
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

              {/* Mobile: one Card per candidate instead of a cramped/scrolling table */}
              <CandidateList>
                {displayedCandidates.map((candidate) => (
                  <CandidateCard key={candidate.submissionId}>
                    <CandidateCardHeader>
                      <div>
                        <StudentName>{candidate.fullName}</StudentName>
                        <StudentEmail>{candidate.email}</StudentEmail>
                      </div>
                      <StatusPill submission={candidate} />
                    </CandidateCardHeader>

                    <CandidateCardMeta>
                      <CandidateCardMetaRow>
                        <Muted>Score</Muted>
                        {candidate.isFullyScored && candidate.score !== undefined ? (
                          <ScoreCell>
                            {candidate.score ?? '-'} / {assessment.totalPoints || 0}
                          </ScoreCell>
                        ) : (
                          <Muted>Not graded</Muted>
                        )}
                      </CandidateCardMetaRow>
                      <CandidateCardMetaRow>
                        <Muted>Submitted</Muted>
                        <Muted>
                          {candidate.submittedAt ? formatDate(candidate.submittedAt) : 'Not submitted'}
                        </Muted>
                      </CandidateCardMetaRow>
                    </CandidateCardMeta>

                    <CandidateCardFooter>
                      <Menu trigger="⋮" items={getMenuItems(candidate)} />
                    </CandidateCardFooter>
                  </CandidateCard>
                ))}
              </CandidateList>

              {(candidatesQuery.data?.pagination?.totalPages || 1) > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={candidatesQuery.data?.pagination?.totalPages || 1}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </Card>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => {
          setCurrentCandidate(null);
          setSnackbar((current) => ({ ...current, open: false }))}
        }
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((current) => ({ ...current, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </DashboardLayout>
  )
}