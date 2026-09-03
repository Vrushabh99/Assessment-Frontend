import { DashboardLayout } from '../../layouts/DashboardLayout'
import styled from 'styled-components'

const Card = styled.section`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`

export function CandidateDashboardPage() {
  return (
    <DashboardLayout title="Candidate workspace" role="Candidate">
      <Card>
        <h2>Assigned assessments</h2>
        <Muted>Your assigned assessments and attempt history will appear here.</Muted>
      </Card>
    </DashboardLayout>
  )
}
