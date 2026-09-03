import { DashboardLayout } from '../../layouts/DashboardLayout'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const Card = styled.section`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`

export function AssessmentAttemptPage() {
  const { assessmentId } = useParams()

  return (
    <DashboardLayout title="Assessment attempt" role="Candidate">
      <Card><h2>Assessment {assessmentId}</h2></Card>
    </DashboardLayout>
  )
}
