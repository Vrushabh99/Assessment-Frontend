import styled from "styled-components"

export const Card = styled.section`
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: 0 12px 32px ${({ theme }) => theme.colors.shadow};
`
export const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 640px) { flex-direction: column; padding: 16px 10px; gap: 10px; }
`
export const AssessmentList = styled.div`
  display: grid;
  gap: 12px;
  padding: 16px;
  @media (max-width: 640px) { padding: 16px 10px; }
  @media (max-width: 400px) {
    padding: 10px 8px;
  }
`
export const AssessmentCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  @media (max-width: 640px) { align-items: flex-start; padding: 18px 10px; flex-direction: column}
`
export const AssessmentTitle = styled.h3`margin: 0 0 8px;`
export const CardActions = styled.div`position: relative; display: flex; align-items: center; gap: 12px; margin-left: auto`
export const Metadata = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`
export const EmptyState = styled.p`padding: 28px 20px; color: ${({ theme }) => theme.colors.muted}; text-align: center;`

export const statusTone = { draft: 'warning', published: 'success', archived: 'neutral' }

export const Muted = styled.p`color: ${({ theme }) => theme.colors.muted};`

export const CandidateCard = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.primarySoft};
  border-radius: 8px;
  margin-bottom: 24px;
`

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const InfoLabel = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.85rem;
`

export const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 1.1rem;
`