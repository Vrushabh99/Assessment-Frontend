import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DashboardLayout } from '../../../layouts/DashboardLayout'
import styled from 'styled-components'
import { getDashboardStats } from '../../../api/dashboard'
import { CommonLoader } from '../../../components/ui/CommonLoader'

const PageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`
const Card = styled.div`
  padding: 24px;
  font-size: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
const StatValue = styled.strong`
  display: block;
  color: ${({ theme }) => theme.colors.primaryText};
  margin-top: 8px;
  font-size: 3rem;
`;

const EmptyState = styled.p`padding: 28px 20px; color: ${({ theme }) => theme.colors.muted}; text-align: center;`


export function AdminDashboardPage() {
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboardStats(),
  });

  const { data, isLoading, isError, error } = query || {};
  
  return (
    <DashboardLayout title="Admin workspace" role="Administrator">
      {isLoading && <CommonLoader label="Loading dashboard..." />}
      {isError && <EmptyState role="alert">{error.message}</EmptyState>}
      {data && (

        <PageGrid>
        <Card>Assessments<StatValue>{data.totalAssessments}</StatValue></Card>
        <Card>Assignments<StatValue>{data.totalAssignments}</StatValue></Card>
        <Card>Active Assignments<StatValue>{data.totalActiveAssignments}</StatValue></Card>
        
        <Card>Questions<StatValue>{data.totalQuestions}</StatValue></Card>
        <Card>Candidates<StatValue>{data.totalCandidates}</StatValue></Card>
        <Card>Assigned candidates<StatValue>{data.candidatesAssigned}</StatValue></Card>
        <Card>Submissions<StatValue>{data.totalSubmissions}</StatValue></Card>
      </PageGrid>
      )}
    </DashboardLayout>
  )
}
