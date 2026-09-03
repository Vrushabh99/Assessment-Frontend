import { DashboardLayout } from '../../../layouts/DashboardLayout'
import styled from 'styled-components'

const Card = styled.section`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`

export function AssessmentManagementPage() {
  return (
    <DashboardLayout title="Manage assessments" role="Administrator">
      <Card><h2>Assessment catalog</h2></Card>
    </DashboardLayout>
  )
}
