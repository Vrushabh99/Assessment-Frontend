import { DashboardLayout } from '../../../layouts/DashboardLayout'
import styled from 'styled-components'

const PageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`
const Card = styled.article`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
const StatValue = styled.strong`display: block; margin-top: 8px; font-size: 2rem;`
const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`

export function AdminDashboardPage() {
  return (
    <DashboardLayout title="Admin workspace" role="Administrator">
      <PageGrid>
        <Card>Assessments<StatValue>0</StatValue></Card>
        <Card>Assigned candidates<StatValue>0</StatValue></Card>
        <Card>Submissions<StatValue>0</StatValue></Card>
      </PageGrid>
      <Card>
        <h2>Assessment management</h2>
        <Muted>Create assessments, configure proctoring rules, and review submissions.</Muted>
      </Card>
    </DashboardLayout>
  )
}
