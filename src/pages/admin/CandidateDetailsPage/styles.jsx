import styled from "styled-components"

export const AssessmentList = styled.div`display: grid; gap: 12px;`
export const AssessmentCard = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  @media (max-width: 640px) { align-items: flex-start; }
`
export const AssessmentTitle = styled.h3`margin: 0 0 8px;`
export const CardActions = styled.div`position: relative; display: flex; align-items: center; gap: 12px;`
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