import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { CommonLoader } from "../../../components/ui/CommonLoader";
import { ActionWrapper, AssessmentCard, AssessmentList, AssessmentTitle, CandidateCard, Card, CardActions, InfoItem, InfoLabel, InfoValue, Metadata, Muted, Toolbar } from "./styles";
import { CandidateKeys, getCandidateAttempts } from "../../../api/candidates";
import { useNavigate, useParams } from "react-router-dom";
import { Pill } from "../../../components/ui/Pill";
import { Menu } from "../../../components/ui/Menu";
import { Pagination } from "../../../components/ui/Pagination";
import { useState } from "react";
import { DropDown } from "../../../components/ui/DropDown";
import { formatDate } from "../../../utils/helpers";
import { Button } from "../../../components/ui/Button";


export function CandidateDetailsPage() {
  const { candidateId } = useParams()
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const limit = 10;


  const getParams = () => ({
    page,
    limit,
    status: statusFilter === 'all' ? '' : statusFilter
  })

  const query = useQuery({
    queryKey: CandidateKeys.candidateAttempts(candidateId, getParams()),
    queryFn: () => getCandidateAttempts(candidateId, getParams())
  })

  if (query.isLoading) return <DashboardLayout title="Candidate Details" role="Administrator"><CommonLoader label="Loading assessment..." /></DashboardLayout>
  if (query.isError) return <DashboardLayout title="Candidate Details" role="Administrator"><Muted role="alert">{query.error.message}</Muted></DashboardLayout>

  const {
    attempts,
    candidate,
    pagination,
  } = query.data;

  const getMenuItems = (status, assignment) => [
    {
      id: 'view',
      label: 'View Response',
      onClick: () => {
        navigate(`/admin/submissions/${assignment._id}/${candidate._id}`)
      },
    },
    {
      id: 'grade',
      label: 'Grade Response',
      disabled: ['assigned', 'in_progress'].includes(status),
      onClick: () => {
        navigate(`/admin/submissions/${assignment._id}/${candidate._id}/grade`)
      },
    },
  ]
  const StatusTone = {
    assigned: "info",
    in_progress: "warning",
    submitted: "success",
  }
  return (
    <DashboardLayout title="Candidate Details" role="Administrator" hideNavigation>
        <ActionWrapper>
          <Button
            variant="primary"
            onClick={() => navigate(-1)}
            >
            Back
          </Button>
        </ActionWrapper>
        <CandidateCard>
          <InfoItem>
            <InfoLabel>Student</InfoLabel>
            <InfoValue>{candidate.firstName} {candidate.lastName}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Email</InfoLabel>
            <InfoValue>{candidate.email || 'N/A'}</InfoValue>
          </InfoItem>
        </CandidateCard>
      <Card>
        <Toolbar>
        <DropDown
          id="status-filter"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
          }}
          options={[
            { value: 'all', label: 'All' },
            { value: 'assigned', label: 'Assigned' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'submitted', label: 'Submitted' },
          ]}
          style={{
            width: 270,
          }}
        />
        </Toolbar>
        <AssessmentList>
          {attempts.map(({ assessment, assignment, score, status, submittedAt }) => (
            <AssessmentCard key={assessment._id}>
              <div>
                <AssessmentTitle>{assessment.title}</AssessmentTitle>
                <Metadata>
                  <span>{assessment.questionIds?.length || 0} questions</span>
                  <span>•</span>
                  <Pill tone={StatusTone[status]}>
                    {status}
                  </Pill>
                  {status === 'submitted' && (
                    <Pill tone="warning">
                    Score: {score || '-'} / {assessment.totalPoints}
                  </Pill>
                  )}
                  {submittedAt && (
                    <Pill tone="success">
                      Submitted at: {formatDate(submittedAt)}
                    </Pill>
                  )}
                </Metadata>
              </div>
              <CardActions>
                <Menu trigger="⋮" items={getMenuItems(status, assignment, candidate)} />
              </CardActions>
            </AssessmentCard>
          ))}
        </AssessmentList>
        <Pagination
          currentPage={page}
          totalPages={pagination?.totalPages || 1}
          totalItems={pagination?.total}
          onPageChange={setPage}
          itemLabel="assessments"
        />
      </Card>
    </DashboardLayout>

  )
}