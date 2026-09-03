import { DashboardLayout } from '../../../layouts/DashboardLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import styled from 'styled-components'

const Card = styled.section`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
`
const Header = styled.div`display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; @media (max-width: 640px) { flex-direction: column; }`
const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`

export function AssessmentManagementPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const savedAssessment = state?.savedAssessment

  return (
    <DashboardLayout title="Manage assessments" role="Administrator">
      <Header>
        <div>
          <h2>Assessment catalog</h2>
          <Muted>Create assessments by combining a title with questions from your question bank.</Muted>
        </div>
        <Button type="button" onClick={() => navigate('/admin/assessments/new')}>+ Create assessment</Button>
      </Header>
      <Card>
        {savedAssessment ? (
          <>
            <h3>{savedAssessment.title}</h3>
            <Muted>{savedAssessment.questionIds.length} questions included</Muted>
          </>
        ) : (
          <Muted>No assessments created yet.</Muted>
        )}
      </Card>
    </DashboardLayout>
  )
}
